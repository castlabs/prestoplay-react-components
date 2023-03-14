import { logger } from '../log.js'
import { Session } from './session'

/**
 * Validate response from MediaTailor.
 * 
 * @param {!Response} response
 * @returns {!Promise}
 */
const validate = async (response) => {
  const body = await response.json()
  const startDate = new Date(response.headers.get('date'))

  const data = {
    ...body,
    startDate,
  }

  // FUTURE validate without Yup
  // const schema = object({
  //   manifestUrl: string().required(),
  //   trackingUrl: string().required(),
  //   startDate: date().required(),
  // })

  // try {
  //   await schema.validate(data)

  //   const clockDeltaSec = (new Date().getTime() - startDate.getTime()) / 1000
  //   if (clockDeltaSec < 0) {
  //     logger.warn(`Session server clock is ${clockDeltaSec} s ahead of client clock.`)
  //   } else if (clockDeltaSec >= 3) {
  //     logger.warn(`Session start HTTP response transfer took suspiciously long ${clockDeltaSec} s.`)
  //   }
  // } catch (error) {
  //   if (error instanceof Error) {
  //     throw new Error(`Invalid initialization response from MediaTailor ${error.message}`)
  //   } else {
  //     throw error
  //   }
  // }
  
  return data
}

/**
 * Convert response from MediaTailor to MtSessionInfo.
 * 
 * @param {!Response} response
 * @param {!URI} uri
 * @returns {!Promise<MtSessionInfo>}
 */
const convert = async (response, uri) => {
  const data = await validate(response)

  return {
    manifestUri: resolveUri(uri, data.manifestUrl),
    trackingUri: resolveUri(uri, data.trackingUrl),
    startDate: data.startDate,
  }
}

/**
 * Resolve URI.
 * 
 * @param {!URL} uri 
 * @param {string} path 
 * @returns {!URL}
 */
const resolveUri = (uri, path) => {
  return new URL(`${uri.origin}${path}`)
}

/**
 * Initialize MediaTailor session.
 * 
 * @see {@link https://docs.aws.amazon.com/mediatailor/latest/ug/ad-reporting-client-side.html | MediaTailor docs on client-side ad reporting}
 * 
 * @param {!URL} uri session initialization URI
 * @param {!MtSessionConfig} config
 * @returns {!Session} MediaTailor session
 */
export const initialize = async (uri, config) => {
  const response = await fetch(uri, {
    method: "POST",
    body: JSON.stringify({
      adsParams: {
        /** Parameters for ad system */
      }
    })
  })

  const sessionInfo = await convert(response, uri)

  logger.info(`Media Tailor session initialized.
  - manifest URI: ${sessionInfo.manifestUri.toString()}
  - tracking URI: ${sessionInfo.trackingUri.toString()}
  - start date: ${sessionInfo.startDate.toISOString()}`)

  return new Session(sessionInfo, config)
}
