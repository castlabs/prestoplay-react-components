import {clpp} from "@castlabs/prestoplay"
import { logger } from "../log.js"

/**
 * In essence choose a speed delta such that it will take only 5
 * seconds or less to catch up to the main player.
 */
const getSpeedDelta = (absDeltaSec, minDeltaSec) => {
  if (absDeltaSec <= minDeltaSec) {
    return 0
  }

  const divisor = absDeltaSec < 1 ? 6 : 3
  return (absDeltaSec / divisor).toFixed(2)
}

/**
 * @param {{ deltaSec, minDeltaSec, normalRate }}} config 
 * @returns 
 */
const getCatchupRate = (config) => {
  const { deltaSec, minDeltaSec, normalRate } = config
  const absDeltaSec = Math.abs(deltaSec)
  const delta = getSpeedDelta(absDeltaSec, minDeltaSec) * Math.sign(deltaSec)
  return (normalRate + delta).toFixed(2)
}

/**
 * PrestoFleet is a module that allows management of a fleet of consecutively playing PRESTOplay players.
 * 
 * It allows selection of a main player that all secondary players follow.
 * (i.e. if main is paused, secondaries get paused, if it seeks secondaries seek too etc.)
 * 
 * Inspired by @see {@link https://github.com/castlabs/prestoplay-web/compare/master...thasso/multi-view#diff-311ae7fb64a23c20d708bbaa6375abc6d286410c2dbec24aa1fb6710c6ab7d23 | MultiView}
 */
export class PrestoFleet {
  constructor() {
    /**
     * @type {?} main player
     */
    this.mainPlayer_ = null
    /**
     * @type {!Array<?>} secondary players
     */
    this.secondaryPlayers_ = []
    /**
     * @type {!Array<!function>}
     */
    this.disposers_ = []
  }

  add(player) {
    if (this.mainPlayer_) {
      this.addSecondaryPlayer(player)  
    } else {
      this.addMainPlayer(player)
    }
  }

  addMainPlayer(player) {
    this.mainPlayer_ = player

    const onStateChanged = (event) => {
      const state = event.detail.currentState

      if (state === clpp.Player.State.PLAYING) {
        this.mirror_(p => p.play())
      } else if ([clpp.Player.State.PAUSED, clpp.Player.State.BUFFERING, clpp.Player.State.ERROR].includes(state)) {
        this.mirror_(p => p.pause())
      }
    }

    const onTimeUpdate = () => {
      const MIN_DELTA_SEC = 0.05
      const MAX_DELTA_SEC = 5
      const NORMAL_RATE = 1

      this.mirror_(secondaryPlayer => {
        if (secondaryPlayer.getSurface().getMedia().seeking) { // TODO this should be exported on clpp.Player
          // logger.info('Secondary Already seeking...')
          return
        }

        // TODO report the fact that player.getPosition() is sometimes wrong!
        // probably due to clamp in mse/player
        const mainTimeSec = player.getSurface().getMedia().currentTime.toFixed(2)
        const secondaryTimeSec = secondaryPlayer.getSurface().getMedia().currentTime.toFixed(2)
        const deltaSec = (mainTimeSec - secondaryTimeSec).toFixed(2)
        const absDeltaSec = Math.abs(deltaSec)
        const secondaryRate = Number(secondaryPlayer.getPlaybackRate()).toFixed(2) // TODO is sometimes string xxx
        const secondaryState = secondaryPlayer.getState()

        // logger.info('Main time', mainTimeSec, 'secondary time',
        //   secondaryTimeSec, 'deltaSec', deltaSec, 'sec rate',
        //     secondaryRate + typeof secondaryRate, 'sec state', secondaryState)

        if (secondaryState !== clpp.Player.State.PLAYING || absDeltaSec <= MIN_DELTA_SEC) {
            return
        }

        const catchupRate = getCatchupRate({
          deltaSec,
          minDeltaSec: MIN_DELTA_SEC,
          normalRate: NORMAL_RATE,
        })

        if (absDeltaSec >= MAX_DELTA_SEC) {
          // Secondary is far behind, seek to get closer to the main

          secondaryPlayer.setPlaybackRate(NORMAL_RATE)
          // secondaryPlayer.seek(mainTimeSec) TODO does not work for some reason
          secondaryPlayer.getSurface().getMedia().currentTime = mainTimeSec
          return
        }

        if (secondaryRate === catchupRate) {
          if (catchupRate !== NORMAL_RATE) {
            logger.info(`Delta ${deltaSec} s.`)
          }
          return 
        }

        if (catchupRate === NORMAL_RATE) {
          logger.info('Secondary caught up.')
        } else if (catchupRate < NORMAL_RATE) {
          logger.info(`Secondary slowing down to catch up. Rate: ${catchupRate}, delta: ${deltaSec} s`)
        } else if (catchupRate > NORMAL_RATE) {
          logger.info(`Secondary speeding up to catch up. Rate: ${catchupRate}, delta: ${deltaSec} s`)
        }
        secondaryPlayer.setPlaybackRate(catchupRate)
      })
    }

    const onSeeking = () => {
      // FUTURE implement this
    }

    player.on(clpp.events.STATE_CHANGED, onStateChanged)
    player.on('timeupdate', onTimeUpdate)
    player.on(clpp.events.USER_SEEKING, onSeeking)

    this.disposers_.push(() => {
      player.off(clpp.events.STATE_CHANGED, onStateChanged)
      player.off(clpp.events.TIMEUPDATE, onTimeUpdate)
      player.off(clpp.events.USER_SEEKING, onSeeking)
    })
  }

  addSecondaryPlayer(player) {
    this.secondaryPlayers_.push(player)
  }

  clear() {
    this.mainPlayer_ = null
    this.secondaryPlayers_ = []
    this.disposers_.forEach((disposer) => disposer())
    this.disposers_ = []
  }

  mirror_(callback) {
    this.secondaryPlayers_
      .filter(player => player.getLoadedSource() != null) // TODO clpp.Player should allow a better check
      .forEach(callback)
  }
}

export const fleet = new PrestoFleet()
