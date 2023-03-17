import { logger } from "../../log.js"
import { AdInterface } from "../AdInterface.js"

/**
 * @fileoverview Integration of Innovid ads ('innovid' apiFramework).
 * 
 * Innovid ads can be referred to as "Iroll" ads.
 * 
 * This integration is based on this Guide:
 * @see {@link https://github.com/castlabs/innovid-ctv-html-integration#ssai-server-side-ad-insertion-integration|Innovid SSAI}
 */

/**
 * Generate Iroll iframe ad URI.
 * 
 * @param {string} irollAdBaseUri Iroll iframe ad URI base
 * @param {!AdParameters} adParams ad parameters
 * @returns {string} Iroll iframe ad URI
 */
const generateIrollAdIFrameUrl = (irollAdBaseUri, adParams) => {
  /**
   * @type {!IrollRuntimeParameters}
   */
  const params = {
    ssai : true,
    platform: 'samsung', // TODOIN browser not supported, using Samsung instead. Should be passed by lib user.
    advertisingId: adParams.advertisingId,
  }
  const result = new URL(irollAdBaseUri)
  result.hash = `params=${encodeURIComponent(JSON.stringify(params))}`
  return result.toString()
}

/**
 * Create an iframe with Iroll ad in it.
 * 
 * @param {string} irollAdBaseUri Innovid/Iroll iframe ad URI base
 * @param {!AdParameters} adParams ad parameters
 * @return {!HTMLIFrameElement} iframe
 */
const createIrollIframe = (irollAdBaseUri, adParams) => {
  const uri = generateIrollAdIFrameUrl(irollAdBaseUri, adParams)

  const iframe = document.createElement('iframe')

  iframe.setAttribute('class', 'clpp-mt-ad innovid-iroll')
  iframe.setAttribute('src', uri)

  iframe.style.border = '0px'
  iframe.style.position = "absolute"
  iframe.style.background = "transparent"
  iframe.style.left = "0px"
  iframe.style.top = "0px"
  iframe.style.width = "100%"
  iframe.style.height = "100%"

  return iframe
}

/**
 * @returns {boolean} true if valid
 */
const valid = (event) => {
  return event != null && typeof event.type === 'string'
}

const eventMap = {
  'iroll-ready': 'ready',
  'iroll-started': 'started',
  'iroll-video-progress': 'progress',
  'iroll-impression': 'impression',
  'iroll-video-started': 'started',
  'iroll-video-first-quartile': 'first-quartile',
  'iroll-video-midpoint': 'midpoint',
  'iroll-video-third-quartile': 'third-quartile',
  'iroll-video-completed': 'completed',
  'iroll-ended': 'ended',
  // How to convert iroll-video-started?
}

/**
 * Convert Innovid ad event into a normalized ad event.
 * 
 * @param {!InnoAdEvent} innoEvent Innovid ad event
 * @return {!AdEvent} ad event
 */
const convertEvent = (innoEvent) => {
  const type = eventMap[innoEvent.type]

  if (type == null) return null

  return { type, params: innoEvent.params }
}

/**
 * Innovid/Iroll ad.
 */
export class InnovidAd extends AdInterface {
  /**
   * @type {?InnoAdEventListener}
   */
  onEvent_ = null

  /**
   * @type {!Array<function>}
   */
  disposers_ =[]

  /**
   * @param {!InnoAd} ad
   * @param {!HTMLElement} anchorElement
   * @param {!AdParams} adParams ad parameters
   */
  constructor(ad, anchorElement, adParams) {
    super()

    // TODO remove iframe after some when blocked by ad block

    /**
     * @type {!AdParams} ad parameters
     */
    this.adParams_ = adParams
    /**
     * @type {!InnoAd}
     */
    this.ad_ = ad
    /**
     * @type {boolean} seconds
     */
    this.displayed_ = false
    /**
     * @type {!HTMLIFrameElement|null} iframe where ad is begin displayed
     */
    this.iframe_ = null
    /**
     * @type {boolean} whether ad/iframe is ready to receive messages.
     */
    this.adReady_ = false
    /**
     * @type {!HTMLElement}
     */
    this.anchor_ = anchorElement
    /**
     * @type {string} HTTP origin of this ad
     */
    this.adOrigin_ = new URL(this.ad_.iFrameResource).origin
    /**
     * @type {?AdEventListener} event listener
     */
    this.listener_ = null
  }

  /**
   * @override
   * Notify the ad about playback progress.
   * 
   * @param {PlaybackState} playbackState
   * @param {number} playback position in seconds (of content / content with SSAI)
   */
  notify(playbackState, playbackPositionSec) {
    if (!this.adReady_) return

    const position = Math.max(0, playbackPositionSec - this.ad_.positionSec)
    // logger.info(`notify (state: ${playbackState}, position: ${playbackPositionSec} s)`)

    this.iframe_.contentWindow.postMessage(
      { 
        type: 'playback-update', 
        data: { 
          playbackState, 
          position,
        }
      },
      this.adOrigin_
    )
  }

  /**
   * @param {!AdEventListener} listener 
   */
  setEventListener(listener) {
    this.listener_ = listener

    this.onEvent_ = (innoEvent) => {
      const event = convertEvent(innoEvent)
      if (event) {
        listener(event)
      }
    }
  }

  /**
   * @override
   * @param {number} timeSec time in seconds.
   * @return {boolean} true if ad should start at this time.
   */
  shouldStart(timeSec) {
    // FUTURE this logic is not good for seeking, how to handle seeking?
    // return !irollAdInfo.viewed && position >= irollAdInfo.startTime && position < (irollAdInfo.startTime + irollAdInfo.duration);
    // This is generic logic (should be in Ad, not Innovid)
    return this.displayed_ === false && this.ad_.positionSec <= timeSec
  }

  /**
   * @override
   * Display this ad (immediately).
   */
  display() {
    if (this.displayed_) return

    logger.info('Displaying ad...', this.toJSON_())
    this.displayed_ = true

    // FUTURE iframe enhancer fn? e.g. to modify zIndex
    this.iframe_ = createIrollIframe(this.ad_.iFrameResource, this.adParams_)
    this.anchor_.appendChild(this.iframe_)

    /**
     * @param {MessageEvent} event
     */
    const listener = (event) => {
      if (!this.belongsToThisAd_(event)) {
        return
      }
  
      const data = event.data
      if (valid(data)) {
        // logger.info(`Innovid ad event: ${data.type}`, data.params)

        if (data.type === 'iroll-ready') {
          this.adReady_ = true
        } else if (data.type === 'iroll-ended') {
          this.destroy_()
        }

        this.onEvent_?.(data)
      } else {
        logger.error('Received an invalid Innovid ad event.', event)
      }
    }

    window.addEventListener("message", listener)

    /**
     * If the iframe is ad-blocked, there is not way to detect it.
     * So I assume that if 3 seconds pass and the ad is still not ready, it has been ad-blocked
     * and therefore I destroy the iframe and the ad itself.
     */
    let timeoutId = setTimeout(() => {
      if (!this.adReady_) {
        logger.warn('Innovid ad is not ready after 3s, it has likely been ad-blocked, destroying it.')
        this.destroy_()
        this.listener_?.({ type: 'ad-blocked' })
      }

      timeoutId = null
    }, 3000)

    this.disposers_.push(() => {
      window.removeEventListener("message", listener)
      this.anchor_.removeChild(this.iframe_)
      this.iframe_.src = ''
      this.iframe_ = null

      if (timeoutId != null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    })
  }

  destroy_() {
    this.disposers_.forEach((disposer) => disposer())
    this.disposers_ = []
  }

  /**
   * @param {!MessageEvent} event
   * @return {boolean} true if this message originates from this ad's iframe.
   */
  belongsToThisAd_(event) {
    return this.adOrigin_ === event.origin
  }

  /**
   * Serialize.
   */
  toJSON_() {
    return {
      ad: this.ad_,
      parameters: this.adParams_,
      origin: this.adOrigin_,
    }
  }
}
