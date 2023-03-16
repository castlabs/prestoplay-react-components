import { API_FRAMEWORKS } from "../consts.js"
import { logger } from "../log.js"
import { Validator } from "../validate.js"


const DEFAULT_AD_POLLING_FREQUENCY_SEC = 3

/**
 * TODOMT get rid of all these workarounds
 */
const WORKAROUND = {
  /**
   * Because currently it is 0
   */
  getDuration: () => 10,
  /**
   * Because currently it is undefined
   */
  getApiFramework: () => API_FRAMEWORKS.INNOVID,
  /**
   * MediaTailor is not passing the IFrameResource across in our JSON tracking response. We're not yet sure
   * of why but possibly we would need to put in a feature for companion banner VAST parsing, that we won't
   * get through our AppSec team in time for NAB. Wondering if you could please construct the IFrameResource
   * at this time? The URI is almost identical to the staticResource attribute except you would need to find
   * one word (json) and replace it with html.
   */
  getIFrameResource: (ad) => ad.staticResource.replace('.json', '.html'),
}

/**
 * @param {?} data 
 * @returns {!MtAdResponse}
 */
const validateTrackingResponse = (data) => {
  const validator = new Validator('In response from Tracking endpoint')

  const prefix1 = '.avails'

  validator.validateAttr(prefix1, data.avails, 'defined')
  validator.validateAttr(prefix1, data.avails, 'array')

  data.avails.forEach((avail, index) => {
    const prefix2 = `${prefix1}[${index}]`

    validator.validateAttr(`${prefix2}.availId`, avail.availId, 'string')
    validator.validateAttr(`${prefix2}.durationInSeconds`, avail.durationInSeconds, 'number')
    validator.validateAttr(`${prefix2}.startTimeInSeconds`, avail.startTimeInSeconds, 'number')

    if (avail.nonLinearAdsList) {
      const prefix3 = `${prefix2}.nonLinearAdList`
      validator.validateAttr(prefix3, avail.nonLinearAdsList, 'array')
      
      avail.nonLinearAdsList.forEach((list, index2) => {
        const prefix4 = `${prefix3}[${index2}].nonLinearAdList`

        validator.validateAttr(prefix4, list.nonLinearAdList, 'defined')
        validator.validateAttr(prefix4, list.nonLinearAdList, 'array')

        list.nonLinearAdList.forEach((ad, index3) => {
          const prefix5 = `${prefix4}[${index3}]`

          validator.validateAttr(`${prefix5}.adId`, ad.adId, 'string')
          validator.validateAttr(`${prefix5}.adSystem`, ad.adId, 'string')
          // TODOMT uncomment
          // validator.validateAttr(`${prefix5}.durationInSeconds`, ad.adId, 'number')
          // validator.validateAttr(`${prefix5}.iFrameResource`, ad.adId, 'string')
        })
      })
    }
  })

  return data
}

/**
 * MediaTailor session.
 * 
 * @see {@link https://docs.aws.amazon.com/mediatailor/latest/ug/ad-reporting-client-side.html}
 */
export class Session {
  /**
   * @type {?number}
   */
  intervalId_ = null
  /**
   * @type {?MtPlaybackTimelineStart}
   */
  playbackStart_ = null
  /**
   * @type {?string}
   */
  lastAvailId_ = null

  /**
   * @param {!MtSessionInfo} sessionInfo
   * @param {!MtSessionConfig} config
   */
  constructor(sessionInfo, config) {
    /**
     * @type {!MtSessionInfo}
     */
    this.info_ = sessionInfo
    /**
     * @type {!MtSessionConfig}
     */
    this.config_ = config
    /**
     * @type {number}
     */
    this.pollingFrequencySec_ = this.config_.adPollingFrequencySeconds ?? DEFAULT_AD_POLLING_FREQUENCY_SEC
    console.log('this.pollingFrequencySec_: ', this.pollingFrequencySec_);
  }

  destroy() {
    this._stopPollingForAds()
  }

  getVideoUri() {
    return this.info_.manifestUri.toString()
  }
  
  /**
   * Get next ad.
   * 
   * @return {!Promise<!MtAd>}
   */
  getNextAd() {
    return new Promise(async (resolve) => {
      logger.info(`Started polling for MT ads, every ${this.pollingFrequencySec_} s.` +
        ` (endpoint: ${this.info_.trackingUri})`)
      
      /**
       * @param {!MtAd} ad 
       */
      const resolve_ = (ad) => {
        this.lastAvailId_ = ad.availId
        resolve(ad)
      }

      const ads = await this.requestAds_()

      // FUTURE work with multiple ads
      if (ads[0]) {
        resolve_(ads[0])
        return
      }

      this._startPollingForAds(ad => {
        this._stopPollingForAds()
        resolve_(ad)
      })
    })
  }

  /**
   * @param {MtPlaybackTimelineStart} start 
   */
  setPlaybackStart(start) {
    this.playbackStart_ = start
  }

  isSupportedAd_ = (ad) => {
    return this.config_.supportedApiFrameworks.includes(ad.apiFramework)
  }

  /**
   * @return {!Promise<!Array<!MtAd>>}
   */
  async requestAds_() {
    try {
      const response = await fetch(this.info_.trackingUri.toString())
      /**
       * @type {!MtAdResponse}
       */
      const json = await response.json()
      const data = validateTrackingResponse(json)
      const ads = this.parseAds_(data)
      return ads.filter(this.isSupportedAd_)
    } catch (error) {
      logger.error('Error while polling for ads', error)
      return []
    }
  }

  /**
   * @param {!MtAdResponse} data
   * @returns {!Array<!MtAd>}
   */
  parseAds_(data) {
    if (data.avails.length === 0) {
      return []
    }

    // FUTURE work with multiple avails
    /**
     * @type {!MtAdAvail}
     */
    const avail = data.avails[0]

    if (avail.availId === this.lastAvailId_) {
      logger.info(`Ad already loaded, ignoring. (availId: ${avail.availId})`)
      return []
    }
    
    /**
     * @type {!Array<!MtAd>}
     */
    const result = []

    avail.nonLinearAdsList?.forEach((list) => {
      list.nonLinearAdList?.forEach(ad => {
        result.push({
          availId: avail.availId,
          apiFramework: WORKAROUND.getApiFramework(),
          id: ad.adId,
          iFrameResource: WORKAROUND.getIFrameResource(ad),
          durationSec: WORKAROUND.getDuration(),
          // TODOMT timesync result is not aligned with MT ad space. Ask MT team.
          positionSec: this._calculateAdStart(avail.startTimeInSeconds),
        })
      })
    })

    logger.warn('Note that a workaround is used to transform MediaTailor ad response. Response', result)

    return result
  } 

  /**
   * @param {number} mtAdPositionSec ad position since the start of MediaTailor session in seconds
   * @returns {number} ad position on our playback timeline in seconds
   * 
   * @see {@link docs/time_sync.drawio}
   */
  _calculateAdStart(mtAdPositionSec) {
    /**
     * When an ad is coming, the response from AWS Elemental MediaTailor to the player's
     * polling request contains a JSON object that specifies the time offsets for the ad avails.
     * The offsets are relative to when the player initiated the session.
     * You can use them when programming specific behaviors in the player, such as preventing
     * the viewer from skipping past the ads. The response also includes duration, timing,
     * and identification information.
     * @see {@link https://docs.aws.amazon.com/mediatailor/latest/ug/ad-reporting-client-side.html}
     */

    if (this.playbackStart_ == null) {
      return null
    }

    /**
     * Ad position since the start of MediaTailor session in seconds.
     */
    const S = mtAdPositionSec
    /**
     * Difference between start of playback and start of MediaTailor session in seconds.
     */
    const D = (this.playbackStart_.date.getTime() - this.info_.startDate.getTime()) / 1000
    /**
     * First timeupdate value of our player. For VOD this should be 0, but for
     * live this is often not 0. (can be e.g. 56)
     */
    const T0 = this.playbackStart_.startTimeSec
    const result = S - D + T0

    logger.info(`Calculated ad start: ${result.toFixed(2)} s := ${S.toFixed(2)} (S) - `
     + `${D.toFixed(2)} (D) + ${T0.toFixed(2)} (T0)`)

    return result
  }

  /**
   * @param {!MtAdDataCallback} callback 
   */
  _startPollingForAds(callback) {
    this.intervalId_ = setInterval(async () => {
      const ads = await this.requestAds_()

      // FUTURE work with multiple ads
      if (ads[0]) {
        callback(ads[0])
      }
    }, this.pollingFrequencySec_ * 1000)
  }

  _stopPollingForAds() {
    if (this.intervalId_ != null) {
      logger.info('Stopped polling for MT ads')

      clearInterval(this.intervalId_)
      this.intervalId_ = null
    }
  }
}
