import React, { ForwardedRef, forwardRef, useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { useCues } from '../hooks/hooks'
import { usePrestoEnabledState, usePrestoUiEvent } from '../react'

import { SeekBarCues } from './SeekBarCues'
import { Slider } from './Slider'
import { Thumbnail } from './Thumbnail'

import type { BaseComponentProps } from './types'

export interface SeekBarProps extends BaseComponentProps {
  adjustWhileDragging?: boolean
  adjustWithKeyboard?: boolean
  enableThumbnailSlider?: boolean
  keyboardSeekForward?: number
  keyboardSeekBackward?: number
  notFocusable?: boolean
  enabled?: boolean
  /**
   * If cues should be shown on the timeline. Default: true.
   */
  showCues?: boolean
  /**
   * Class name passed to <Slider /> sub-component.
   */
  sliderClassName?: string
}

const useEnabled = (enabled: boolean) => {
  const playerEnabled = usePrestoEnabledState()
  return enabled && playerEnabled
}

/**
 * Seek bar.
 * Seek bar displays video timeline and playback progress, it can be used for seeking.
 * 
 * @param ref - reference to the top element of the Slider component
 */
export const SeekBar = forwardRef((props: SeekBarProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { player } = useContext(PrestoContext)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hoverPosition, setHoverPosition] = useState(-1)
  const [hoverValue, setHoverValue] = useState(0)
  const [thumbWidth, setThumbWidth] = useState(0)
  const enabled = useEnabled(props.enabled ?? true)
  const cues = useCues()
  const showCues = props.showCues ?? true

  function updateFromPlayer(position?: number): number {
    const range = player.seekRange
    const rangeDuration = range.end - range.start
    setDuration(rangeDuration)
    position = position || player.position
    const positionInRange = position - range.start
    const progress = Math.min(100, Math.max(0, 100.0 * (positionInRange / rangeDuration)))
    setProgress(progress)
    return progress
  }

  usePrestoUiEvent('position', (position) => {
    updateFromPlayer(position)
  })

  function applyValue(progressValue: number) {
    player.surfaceInteraction()

    const seekRange = player.seekRange
    const range = seekRange.end - seekRange.start
    player.position = seekRange.start + (range * (progressValue / 100.0))
  }

  function applyHoverValue(hoverValue: number) {
    if (hoverValue <= 0) {
      player.setHoverPosition(null)
      setHoverPosition(hoverValue)
      setHoverValue(0)
      return
    }

    player.surfaceInteraction()

    const seekRange = player.seekRange
    const range = seekRange.end - seekRange.start
    const hoverPosition = seekRange.start + (range * (hoverValue / 100.0))
    player.setHoverPosition({ position: hoverPosition, percent: hoverValue })
    setHoverValue(hoverValue)
    setHoverPosition(hoverPosition)
  }

  const onThumbSize = (width: number) => {
    setThumbWidth(width)
  }

  const renderThumbnailSlider = () => {
    if (!props.enableThumbnailSlider || !enabled) {return}
    return (
      <Thumbnail
        position={hoverPosition}
        onThumbSize={onThumbSize}
        style={{
          position: 'absolute',
          margin: 'auto',
          left: `min(max(${thumbWidth / 2}px, ${hoverValue}%), calc(100% - ${thumbWidth / 2}px))`,
        }}/>
    )
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const range = player.seekRange
    let targetPosition = -1
    const seekForward = props.keyboardSeekForward ?? 10
    const seekBackward = props.keyboardSeekBackward ?? -10
    const currentTime = player.position
    if (e.key === 'ArrowLeft' && seekBackward !== 0) {
      targetPosition = Math.max(range.start, currentTime + seekBackward)
    } else if (e.key === 'ArrowRight' && seekForward !== 0) {
      targetPosition = Math.min(currentTime + seekForward, range.end)
    }
    if (targetPosition >= 0) {
      player.position = targetPosition
      const rangeDuration = range.end - range.start
      const positionInRange = targetPosition - range.start
      const progress = Math.min(100, Math.max(0, 100.0 * (positionInRange / rangeDuration)))
      setProgress(progress)
    }
  }

  return (
    <div
      data-testid="pp-ui-seekbar"
      className={`pp-ui-seekbar ${props.className || ''}`} style={props.style}>
      <div className="pp-ui-seekbar-layer">
        <Slider
          className={props.sliderClassName}
          ref={ref}
          hoverMovement={true}
          value={progress}
          onKeyDown={props.adjustWithKeyboard ? undefined : onKeyDown}
          disableKeyboardAdjustments={!props.adjustWithKeyboard}
          onApplyValue={applyValue}
          onApplyHoverValue={applyHoverValue}
          adjustWhileDragging={props.adjustWhileDragging}
          disabled={!enabled}
          notFocusable={props.notFocusable}
        />
      </div>
      {renderThumbnailSlider()}
      {showCues && cues.length > 0 ? (
        <div className='pp-ui-seekbar-layer cues'>
          <SeekBarCues cues={cues} duration={duration} />
        </div>
      ): null}
    </div>
  )
})

SeekBar.displayName = 'SeekBar'
