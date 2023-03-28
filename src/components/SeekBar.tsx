import React, { ForwardedRef, forwardRef, useState } from 'react'

import Player from '../Player'
import { usePrestoEnabledState, usePrestoUiEvent } from '../react'
import { BasePlayerComponentProps } from '../utils'

import Slider from './Slider'
import Thumbnail from './Thumbnail'

export interface SeekBarProps extends BasePlayerComponentProps {
  adjustWhileDragging?: boolean
  adjustWithKeyboard?: boolean
  enableThumbnailSlider?: boolean
  keyboardSeekForward?: number
  keyboardSeekBackward?: number
  notFocusable?: boolean
  enabled?: boolean
}

const useEnabled = (player: Player, enabled: boolean) => {
  const playerEnabled = usePrestoEnabledState(player)
  return enabled && playerEnabled
}

export const SeekBar = forwardRef((props: SeekBarProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [progress, setProgress] = useState(0)
  const [hoverPosition, setHoverPosition] = useState(-1)
  const [hoverValue, setHoverValue] = useState(0)
  const [thumbWidth, setThumbWidth] = useState(0)
  const enabled = useEnabled(props.player, props.enabled ?? true)

  function updateFromPlayer(position?: number): number {
    const player = props.player
    const range = player.seekRange
    const rangeDuration = range.end - range.start
    position = position || props.player.position
    const positionInRange = position - range.start
    const progress = Math.min(100, Math.max(0, 100.0 * (positionInRange / rangeDuration)))
    setProgress(progress)
    return progress
  }

  usePrestoUiEvent('position', props.player, async (position) => {
    updateFromPlayer(position)
  })

  async function applyValue(progressValue: number) {
    props.player.surfaceInteraction()

    const seekRange = props.player.seekRange
    const range = seekRange.end - seekRange.start
    props.player.position = seekRange.start + (range * (progressValue / 100.0))
  }

  async function applyHoverValue(hoverValue: number) {
    if (hoverValue <= 0) {
      props.player.setHoverPosition(hoverValue, hoverValue)
      setHoverPosition(hoverValue)
      setHoverValue(0)
      return
    }

    props.player.surfaceInteraction()

    const seekRange = props.player.seekRange
    const range = seekRange.end - seekRange.start
    const hoverPosition = seekRange.start + (range * (hoverValue / 100.0))
    props.player.setHoverPosition(hoverPosition, hoverValue)
    setHoverValue(hoverValue)
    setHoverPosition(hoverPosition)
  }

  const onThumbSize = (width: number) => {
    setThumbWidth(width)
  }

  const renderThumbnailSlider = () => {
    if (!props.enableThumbnailSlider || !enabled) {return}
    return (
      <Thumbnail player={props.player} position={hoverPosition}
        onThumbSize={onThumbSize}
        style={{
          position: 'absolute',
          margin: 'auto',
          left: `min(max(${thumbWidth / 2}px, ${hoverValue}%), calc(100% - ${thumbWidth / 2}px))`,
        }}/>
    )
  }

  const onKeyDown = async (e: KeyboardEvent) => {
    const player = props.player
    const range = player.seekRange
    let targetPosition = -1
    const seekForward = props.keyboardSeekForward ?? 10
    const seekBackward = props.keyboardSeekBackward ?? -10
    const currentTime = player.position
    if (e.key == 'ArrowLeft' && seekBackward != 0) {
      targetPosition = Math.max(range.start, currentTime + seekBackward)
    } else if (e.key == 'ArrowRight' && seekForward != 0) {
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
    <div className={`pp-ui-seekbar ${props.className || ''}`} style={props.style} ref={ref}>
      <Slider
        hoverMovement={true}
        value={progress}
        onKeyDown={props.adjustWithKeyboard ? undefined : onKeyDown}
        disableKeyboardAdjustments={!props.adjustWithKeyboard}
        onApplyValue={applyValue}
        onApplyHoverValue={applyHoverValue}
        adjustWhileDragging={props.adjustWhileDragging}
        disabled={!enabled}
        notFocusable={props.notFocusable}
      >
      </Slider>
      {renderThumbnailSlider()}
    </div>
  )
})
export default SeekBar
