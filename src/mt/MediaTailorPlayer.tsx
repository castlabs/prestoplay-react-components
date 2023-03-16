import React, { useEffect, useMemo, useRef } from "react"

import { PlayerSurface } from '../components/PlayerSurface'
import { BaseThemeOverlay } from '../components/BaseThemeOverlay'
import { Player } from '../Player'
import { PmiPlayer } from "./services/pmi/pmiPlayer"
import { configurePrestoComponents } from "./presto.js"

type Props = {
  prestoConfig: { license?: string },
  mediaTailorConfig: {
    sessionUri: string,
    /**
     * adsParams for sessionUri request.
     */
    adsParams?: Record<string, any>,
    /**
     * Default is 3 seconds.
     */
    adPollingFrequencySeconds?: number
  }
  poster?: string,
  autoplay?: boolean,
}

/**
 * Player that plays MediaTailor stream.
 */
export const MediaTailorPlayer = (props: Props) => {
  const pmiPlayer = useRef<any>(null)
  const uiPlayer = useRef(new Player(pp => {
    configurePrestoComponents(pp)

    pmiPlayer.current = new PmiPlayer(pp, {
      advertisingId: '00000000-0000-0000-0000-000000000000',
      platform: 'browser',
      // FUTURE improve this
      anchorElement: document.getElementsByTagName('video')[0].parentElement,
    })
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
  }, [])

  const play = async (config: Props['mediaTailorConfig']) => {
    await pmiPlayer.current.playMediaTailor(config)
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
          seekbarEnabled={false}
        />
      </PlayerSurface>
  )
}

// FUTURE Transition to fullscreen has big graphic glitches.
