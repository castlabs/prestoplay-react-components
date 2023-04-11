import React, { useEffect, useMemo, useRef } from "react"

import { PlayerSurface } from '../components/PlayerSurface'
import { BaseThemeOverlay } from '../components/BaseThemeOverlay'
import { Player } from '../Player'
import { PmiPlayer } from "./services/pmi/pmiPlayer"
import { configurePrestoComponents } from "./presto.js"
import { logger } from "./services/log"

type Props = {
  /**
   * PRESTOplay player configuration.
   */
  prestoConfig: {
    /**
     * License can be undefined for development purposes on localhost. Otherwise it is required.
     * A license can be obtained from castLabs for a specific domain.
     */
    license?: string
  },
  /**
   * MediaTailor session configuration.
   */
  mediaTailorConfig: {
    /**
     * MediaTailor session URI.
     */
    sessionUri: string,
    /**
     * adsParams for sessionUri request.
     */
    adsParams?: Record<string, any>,
    /**
     * Default is 3 seconds.
     */
    adPollingFrequencySeconds?: number
    /**
     * Ad duration (assuming all ads have the same duration).
     */
    adDurationSeconds?: number,
  }
  /**
   * Poster image to display before video playback is requested.
   */
  poster?: string,
  /**
   * Autoplay the video immediately Note: that classic browser auto-play rules and limitations apply here.
   */
  autoplay?: boolean,
  /**
   * Start the player with muted volume. By default not muted.
   */
  mute?: boolean,
  /**
   * Enable video quality selection. By default disabled.
   */
  enableQualitySelection?: boolean,
  /**
   * When enabled, if multiple players are rendered, they will auto-sync to provide
   * smooth side-by-side playback of the same frames (same playback position/time).
   * By default enabled.
   */
  enableFleet?: boolean,
}

/**
 * Player that plays MediaTailor stream.
 */
export const MediaTailorPlayer = (props: Props) => {
  const isFleetEnabled = props.enableFleet !== false

  const pmiPlayer = useRef<any>(null)
  const uiPlayer = useRef(new Player(pp => {
    configurePrestoComponents(pp)

    pmiPlayer.current = new PmiPlayer(pp, {
      advertisingId: '00000000-0000-0000-0000-000000000000',
      platform: 'browser',
      // FUTURE improve this
      anchorElement: document.getElementsByTagName('video')[0].parentElement,
    })

    if (isFleetEnabled) {
      pmiPlayer.current.fleet()
    }
  }))

  useEffect(() => {
    uiPlayer.current.trackLabelerOptions = {
      usePlayingRenditionInAbrLabel: true,
      useNativeLanguageNames: false,
      abrLabel: "Auto",
      disabledTrackLabel: "Off",
      unknownTrackLabel: "Unknown",
      showVideoBitrate: 'Mbps',
    }

    if (isFleetEnabled) {
      logger.info('Fleet enabled')
    }
  }, [])

  const play = async (config: Props['mediaTailorConfig']) => {
    await pmiPlayer.current.playMediaTailor(config)

    if (props.mute) {
      uiPlayer.current.muted = true
    }
    
    // FUTURE improve the way of starting playback via clpp.Player instead
    // of via a prop. The mechanism is not fully ready yet, and that is why
    // here I have to cal setConfigLoaded_()
    uiPlayer.current.setConfigLoaded_()
  }

  useEffect(() => {
    if (props.autoplay) {
      play(props.mediaTailorConfig)
    }
  }, [props.mediaTailorConfig])

  const startButtonConfig = useMemo(() => {
    return {
      onClick: () => play(props.mediaTailorConfig)
    }
  }, [props.mediaTailorConfig])

  return (
      <PlayerSurface
          player={uiPlayer.current}
          baseConfig={props.prestoConfig}
        >
        <BaseThemeOverlay
          player={uiPlayer.current}
          startButton={props.autoplay ? false : startButtonConfig}
          posterUrl={props.poster}
          seekBackward={0}
          seekForward={0}
          seekBar='none'
          menuSelectionOptions={props.enableQualitySelection ? undefined : []}
        />
      </PlayerSurface>
  )
}

// FUTURE Transition to fullscreen has big graphic glitches.
