import React, { useEffect, useMemo, useRef } from "react"

import { PlayerSurface } from '../components/PlayerSurface'
import { BaseThemeOverlay } from '../components/BaseThemeOverlay'
import { Player } from '../Player'
import { PmiPlayer } from "./services/pmi/pmiPlayer"
import { configurePrestoComponents } from "./presto.js"

type Props = {
  config: { license?: string },
  mediaTailorAsset: {
    sessionUri: string,
  }
  poster?: string,
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

  const startButtonConfig = useMemo(() => {
    return {
      onClick: async () => {
        await pmiPlayer.current.playMediaTailor(props.mediaTailorAsset.sessionUri)
        // FUTURE improve the way of starting playback via clpp.Player instead
        // of via a prop. The mechanism is not fully ready yet, and that is why
        // here I have to cal setConfigLoaded_()
        uiPlayer.current.setConfigLoaded_()
      }
    }
  }, [])

  return (
      <PlayerSurface
          player={uiPlayer.current}
          baseConfig={props.config}
        >
        <BaseThemeOverlay
          player={uiPlayer.current}
          startButton={startButtonConfig}
          posterUrl={props.poster}
          seekBackward={0}
          seekForward={0}
          seekbarEnabled={false}
        />
      </PlayerSurface>
  )
}

// FUTURE fix quality selection duplicates
// FUTURE Transition to fullscreen has big graphic glitches.
