import { clpp } from "@castlabs/prestoplay"
import { logger } from "../log.js"
import { InnovidAd } from "../ad/innovid/InnovidAd.js"
import { Mt } from "../mediaTailor/index.js"
import { API_FRAMEWORKS } from "../consts.js"
import { SmartPromise } from "../promise.js"

/**
 * @fileoverview Integration of PRESTOPlay with MediaTailor.
 * 
 * FUTURE replay / play multiple videos / detect that it is a MediaTailor URI
 */

/**
 * Convert PRESTOPlay state to normalized playback state.
 * 
 * @param {number} state PRESTOPlay state
 * @returns {PlaybackState} Playback state
 */
const convertState = (state) => {
  if (
    state === 0 || // IDLE: 0 - when player has been created or released
    state === 1 || // PREPARING: 1 - when player receives the api command to load the movie until it starts requesting the first fragment
    state === 2 || // BUFFERING: 2 - when player doesn't have enough data to play the content for any reasons
    state === 5 || // ENDED: 5 - when video is ended
    state === 6 || // ERROR: 6 - when player encounters an error
    state === 7 // UNSET: 7 - Used exclusively to indicate previous state, when it has no state yet
  ) {
    return 'stopped'
  }

  if (state === 3) { // PLAYING: 3 - when player starts playing content
    return 'playing'
  }

  if (state === 4) { // PAUSED: 4 - when player is stopped
    return 'paused'
  }
}

/**
 * Create an ad according to apiFramework.
 * 
 * @param {!MtAd} ad MediaTailor ad
 * @param {!AdParameters} adParams ad parameters
 * @return {!AdInterface} ad
 */
const createAd = (ad, anchor, adParams) => {
  if (ad.apiFramework === API_FRAMEWORKS.INNOVID) {
    return new InnovidAd(ad, anchor, adParams)
  }

  throw new Error(`Unsupported apiFramework: ${ad.apiFramework}`)
}

/**
 * Integration of PRESTOPlay with MediaTailor.
 */
export class PmiPlayer {
  isStarted_ = false
  /**
   * @type {SmartPromise<!TimelineStart>}
   */
  timelineStart_ = new SmartPromise()
  /**
   * @type {?function}
   */
  onAdEnded = null
  /**
   * @type {!Array<function>}
   */
  disposers_ = []

  /**
   * @param {?} prestoPlayer PRESTOPlay player
   * @param {!AdParameters} adParams ad parameters
   */
  constructor(prestoPlayer, adParams) {
    this.player_ = prestoPlayer

    /**
     * @type {?AdInterface} ad
     */
    this.ad_ = null

    /**
     * @type {!AdParameters}
     */
    this.adParams_ = adParams

    this.anchor_ = this.adParams_.anchorElement
    this.anchor_.style.position = 'relative'
  }

  /**
   * @param {!MtAssetConfig} config MediaTailor asset config
   * @returns {Promise<void>} resolves when video playback starts
   */
  async playMediaTailor(config) {
    // FUTURE allow the load of paused video
    if (this.isStarted_) return
    this.isStarted_ = true

    const mtSession = await Mt.initialize(config, { supportedApiFrameworks: [API_FRAMEWORKS.INNOVID] })
    await this.startContentPlayback_(mtSession.getVideoUri())

    const timelineStart = await this.timelineStart_.promise
    mtSession.setPlaybackStart(timelineStart)

    this.onAdEnded = async () => {
      logger.info('Ad finished.')
      this.loadAndScheduleAd_(mtSession)
    }
    this.loadAndScheduleAd_(mtSession)
  }

  /**
   * @param {!Session} mtSession 
   */
  async loadAndScheduleAd_(mtSession) {
    const ad = await mtSession.getNextAd()

    try {
      this.scheduleAd_(ad)
    } catch (error) {
      logger.error(error)
      this.loadAndScheduleAd_(mtSession)
    }   
  }

  /**
   * Toggle play / pause.
   */
  togglePause() {
    if (this.player_.isPaused()) {
      this.player_.play()
    } else {
      this.player_.pause()
    }
  }
  
  // FUTURE call this when MediaTailor playback ends
  destroy() {
    this.disposers_.forEach((disposer) => disposer())
    this.disposers_ = []
  }

  /**
   * Schedule MediaTailor ad to be inserted at a given time.
   * 
   * @param {!MtAd} ad MediaTailor ad
   * @throws {Error} if failed to schedule the ad because it is invalid.
   */
  scheduleAd_(ad) {
    const error = this.isValidAd_(ad)
    if (error) {
      throw new Error(error)
    }

    this.ad_ = createAd(ad, this.anchor_, this.adParams_)
    this.ad_.setEventListener((event) => {
      if (event.type === 'ended') {
        this.onAdEnded?.()
      }
    })
    
    logger.info(`Scheduled ad to be displayed ${Math.floor(ad.positionSec - this.player_.getPosition())} s `
      +`from now. (At position ${Math.floor(ad.positionSec)} s)`)
  }

  /**
   * Start playback of content video.
   * 
   * @param {string} uri content video URI 
   * @returns 
   */
  async startContentPlayback_(uri) {
    logger.info(`Starting content playback. (URI: ${uri})`)

    this.startListeningToPlayerEvents_()

    await this.player_.load(uri)
    await this.player_.play()
  }

  handlePlaybackEvent_ = () => {
    if (!this.ad_) return

    const positionSec = this.player_.getPosition()
    const stateCode = this.player_.getState()
    const state = convertState(stateCode)
    // logger.info(`Playback time/state change: ${positionSec} s, state: ${state} (${stateCode})`)

    if (this.ad_.shouldStart(positionSec)) {
      this.ad_.display()
      return
    }

    this.ad_.notify(state, positionSec)
  }

  startListeningToPlayerEvents_() {
    const timeListener = () => {
      if (!this.timelineStart_.isDone()) {
        this.timelineStart_.resolve({
          date: new Date(),
          startTimeSec: this.player_.getPosition(),
        })
      }

      this.handlePlaybackEvent_()
    }

    const changeListener = () => {
      this.handlePlaybackEvent_()
    }

    this.player_.on('timeupdate', timeListener)
    this.player_.on(clpp.events.LOADEDMETADATA, changeListener)
    this.player_.on(clpp.events.STATE_CHANGED, changeListener)

    this.disposers_.push(() => {
      this.ad_ = null
      this.player_.off('timeupdate', timeListener)
      this.player_.off(clpp.events.LOADEDMETADATA, changeListener)
      this.player_.off(clpp.events.STATE_CHANGED, changeListener)
    })
  }

  /**
   * @param {!MtAd} ad ad
   * @return {?string} error
   */
  isValidAd_(ad) {
    const currentTime = this.player_.getPosition()
    if (ad.positionSec > currentTime) {
      return null
    }

    return `Ad is positioned in the past ${ad.positionSec} s (current time is ${currentTime} s).`
  }
}
