
import React, { useCallback, useState } from 'react'

import { BaseThemeOverlay } from '../../components/BaseThemeOverlay'
import { HorizontalBar } from '../../components/HorizontalBar'
import { StartButton } from '../../components/StartButton'
import { ControlsVisibilityMode } from '../../services/controls'
import { useHlsInterstitial, usePrestoUiEventHlsi } from '../hooks'
import { HlsInterstitial, InterstitialControls } from '../types'

import { CountDown } from './Countdown'


export type Props = {
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
   * Callback called when the intermission ended.
   */
  onIntermissionEnded?: () => any
  /**
   * Callback called when start button was clicked
   */
  onStartClick?: () => any
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
   * Render a custom top companion component.
   */
  renderTopCompanion?: (isFullScreen: boolean) => (JSX.Element | null)
  /**
   * Custom class name for the player container.
   */
  className?: string
  /**
   * Custom style for the player container.
   */
  style?: React.CSSProperties
  /**
   * Player controls to shown during interstitial playback.
   */
  interstitialControls?: InterstitialControls
}

/**
 * UI overlay for HLS interstitial player.
 */
export const InterstitialOverlay = React.memo((props: Props) => {
  const [hadInteraction, setHadInteraction] = useState(false)
  const [intermission, setIntermission] = useState(true)
  const interstitial = useHlsInterstitial()
  const loop = props.loop ?? true

  let seekStep = props.seekStep ?? 10
  let hasFullScreenButton = props.hasFullScreenButton ?? true
  let hasAudioControls = props.hasAudioControls ?? false
  let hasTime = true
  let hasPauseButton = true
  if (props.interstitialControls && interstitial) {
    if (props.interstitialControls.seekButtons === false) {
      seekStep = 0
    }
    hasFullScreenButton = props.interstitialControls.fullScreen
    hasAudioControls = props.interstitialControls.audio
    hasTime = props.interstitialControls.time
    hasPauseButton = props.interstitialControls.pause
  }

  const endIntermission = useCallback(() => {
    setIntermission(false)
    props.onIntermissionEnded?.()
  }, [props.onIntermissionEnded])

  const onStartClick = useCallback(() => {
    setHadInteraction(true)
    props.onStartClick?.()
  }, [props.onStartClick])

  usePrestoUiEventHlsi('ended', () => {
    if (loop) {
      props.onLoopEnded?.()
      setIntermission(true)
    } else {
      props.onEnded?.()
    }
  })

  /**
   * Render info about the currently playing HLS interstitial if there is one.
   */
  const renderInterstitialInfo = () => {
    if (!interstitial) {
      return null
    }

    let content = null
    if (props.renderInterstitialLabel) {
      content = props.renderInterstitialLabel(interstitial)
    } else {
      let text = null
      if (props.interstitialLabel) {
        text = props.interstitialLabel(interstitial)
      } else {
        text = `Interstitial ${interstitial.podOrder} of ${interstitial.podCount}`
      }
      content = <div className="pp-ui-hlsi-companion-label">{text}</div>
    }

    return (
      <HorizontalBar className="pp-ui-transparent pp-ui-interstitial-companion">
        {content}
      </HorizontalBar>
    )
  }

  if (!hadInteraction) {
    return <StartButton onClick={onStartClick}/>
  }

  if (intermission) {
    const duration =  props.intermissionDuration ?? 3
    return <CountDown
      render={props.renderIntermission}
      seconds={duration}
      onDone={endIntermission}
    />
  }

  return <BaseThemeOverlay
    startButton={false}
    seekForward={seekStep}
    seekBackward={-seekStep}
    hasAudioControls={hasAudioControls}
    hasFullScreenButton={hasFullScreenButton}
    hasTrackControls={props.hasTrackControls ?? false}
    controlsVisibility={props.controlsVisibility ?? 'always-visible'}
    seekBarSliderClassName={interstitial ? 'pp-ui-color-gold' : undefined}
    hasPauseButton={hasPauseButton}
    hasTime={hasTime}
    showSeekBarCues={props.showInterstitialMarkers}
    renderBottomCompanion={renderInterstitialInfo}
    hasTopControlsBar={props.hasTopControlsBar ?? true}
    renderTopCompanion={props.renderTopCompanion}
  />
})

InterstitialOverlay.displayName = 'InterstitialOverlay'
