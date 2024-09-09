import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.hls'
import React, { useEffect, useRef } from 'react'

import { ControlsVisibilityMode } from '../services/controls'
import { enableFocus } from '../utils'

import { InterstitialOverlay } from './components/OverlayHlsi'
import { PlayerSurfaceHlsi } from './components/PlayerSurfaceHlsi'
import { PlayerHlsi } from './PlayerHlsi'
import { HlsInterstitial, InterstitialControls } from './types'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
clpp.install(clpp.hls.HlsComponent)

export type InterstitialPlayerProps = {
  /**
   * HLS interstitial Asset
   */
  asset: clpp.PlayerConfiguration
  /**
   * If the asset should be played back in a loop, one cycle of the loop
   * consists of a few seconds of intermission and then the asset is played.
   * Default: true.
   */
  loop?: boolean
  /**
   * Intermission duration in seconds, defaults to 3.
   */
  intermissionDuration?: number | null
  /**
   * Intermission element renderer. Default: Countdown
   */
  renderIntermission?: (seconds: number) => (JSX.Element | null)
  /**
   * Callback called when playback ended (if loop is `false`)
   */
  onEnded?: () => any
  /**
   * Callback called when one loop cycle ended (if loop is `true`)
   */
  onLoopEnded?: () => any
  /**
   * Callback called when intermission ended
   */
  onIntermissionEnded?: () => any
  /**
   * Interstitial label text renderer. Default: `Interstitial ${podOrder} of ${podCount}`
   */
  interstitialLabel?: (i: HlsInterstitial) => string
  /**
   * Interstitial label component renderer.
   */
  renderInterstitialLabel?: (i: HlsInterstitial) => (JSX.Element | null)
  /**
   * Visibility mode of UI controls. Default: 'always-visible'
   */
  controlsVisibility?: ControlsVisibilityMode
  /**
   * Seek step in seconds for seek buttons. A value of 0 will hide the buttons.
   * Default: 10.
   */
  seekStep?: number
  /**
   * If true interstitial markers should be shown on the timeline. Default: true.
   */
  showInterstitialMarkers?: boolean
  /**
   * If true, a fullscreen button is displayed. Defaults to true.
   */
  hasFullScreenButton?: boolean
  /**
   * If true, audio controls are displayed. Defaults to false.
   */
  hasAudioControls?: boolean
  /**
   * If true, track controls are displayed. Defaults to false.
   */
  hasTrackControls?: boolean
  /**
   * If true, the top controls bar is displayed. Defaults to true.
   */
  hasTopControlsBar?: boolean
  /**
   * Callback called when the player of multi-controller changes.
   */
  onPlayerChanged?: (p: clpp.Player) => any
  /**
   * Options for clpp.interstitial.Player
   */
  interstitialOptions?: Omit<clpp.interstitial.Options, 'anchorEl'>
  /**
   * Custom class name for the player container.
   */
  className?: string
  /**
   * Custom style for the player container.
   */
  style?: React.CSSProperties
  /**
   * Render a custom top companion component.
   */
  renderTopCompanion?: (isFullScreen: boolean) => (JSX.Element | null)
  /**
   * Player controls to shown during interstitial playback.
   */
  interstitialControls?: InterstitialControls
  /**
   * Callback to get the instance of the HLS interstitial player
   */
  onHlsiPlayerReady?: (player: clpp.interstitial.Player) => void
  /**
   * Enable focus-based keyboard interactivity. Default: true.
   */
  enableFocus?: boolean
}

/**
 * A dedicated component for playback of HLS streams with interstitials.
 *
 * By default the stream is played in an infinite loop with a countdown
 * intermission in between.
 */
export const InterstitialPlayer = React.memo((props: InterstitialPlayerProps) => {
  const playerRef = useRef(new PlayerHlsi(props.onHlsiPlayerReady))

  useEffect(() => {
    enableFocus(props.enableFocus ?? true)
  }, [props.enableFocus])

  const load = async () => {
    try {
      await playerRef.current.loadHlsi(props.asset)
    } catch (e) {
      console.error('Interstitial player Failed to load asset', e)
    }
  }

  useEffect(() => {
    if (props.onPlayerChanged) {
      playerRef.current.onUIEvent('playerChanged', props.onPlayerChanged)
    }

    return () => {
      if (props.onPlayerChanged) {
        playerRef.current.offUIEvent('playerChanged', props.onPlayerChanged)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      playerRef.current.destroy().catch(e => {
        console.error('Failed to destroy Interstitial player', e)
      })
    }
  }, [])

  let className = 'pp-ui-hlsi-player'
  if (props.className) {
    className += ` ${props.className}`
  }

  return (
    <div className={className} style={props.style}>
      <PlayerSurfaceHlsi
        player={playerRef.current}
        interstitialOptions={props.interstitialOptions}
      >
        <InterstitialOverlay
          {...props}
          onStartClick={async () => {
            await load()
            if (props.intermissionDuration === null) {
              await playerRef.current.unpause()
            }
          }}
          onLoopEnded={async () => {
            props.onLoopEnded?.()
            await playerRef.current.reset()
            await load()
            if (props.intermissionDuration === null) {
              await playerRef.current.unpause()
            }
          }}
          onIntermissionEnded={async () => {
            props.onIntermissionEnded?.()
            await playerRef.current.unpause()
          }}
        />
      </PlayerSurfaceHlsi>
    </div>
  )
})

InterstitialPlayer.displayName = 'InterstitialPlayer'
