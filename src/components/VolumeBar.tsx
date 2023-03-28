import React, { useState } from 'react'

import { usePresto, usePrestoEnabledState, usePrestoUiEvent } from '../react'
import { BasePlayerComponentProps } from '../utils'

import { Slider } from './Slider'

export interface VolumeBarProps extends BasePlayerComponentProps{
  adjustWhileDragging?: boolean
  notFocusable?: boolean
}

export const VolumeBar = (props: VolumeBarProps) => {
  const [progress, setProgress] = useState(100)
  const enabled = usePrestoEnabledState(props.player)

  function updateFromPlayer(): number {
    const player = props.player
    const progress = player.muted ? 0 : (player.volume * 100)
    setProgress(progress)
    return progress
  }

  usePrestoUiEvent('volumechange', props.player, () => {
    updateFromPlayer()
  })

  usePresto(props.player,  () => {
    updateFromPlayer()
  })

  usePrestoUiEvent('statechanged', props.player, () => {
    updateFromPlayer()
  })

  const applyValue = (progressValue: number) => {
    setProgress(progressValue)
    props.player.volume = progressValue / 100.0
  }

  const onKeyDown = async (e: KeyboardEvent) => {
    const presto = await props.player.presto()
    const current = presto.isMuted() ? 0 : presto.getVolume()
    let targetPosition = current
    
    if (e.key == 'ArrowLeft') {
      targetPosition = Math.max(0, current + (-0.1))
      e.preventDefault()
    } else if (e.key == 'ArrowRight') {
      targetPosition = Math.min(1, current + (0.1))
      e.preventDefault()
    }

    if (targetPosition != current) {
      presto.setVolume(targetPosition)
      if (presto.isMuted() && targetPosition > 0) {
        presto.setMuted(false)
      }
    }
  }

  return (
    <div className={`pp-ui-volumebar ${props.className || ''}`}>
      <Slider
        value={progress}
        onApplyValue={applyValue}
        onKeyDown={onKeyDown}
        adjustWhileDragging={props.adjustWhileDragging}
        disabled={!enabled}
        notFocusable={props.notFocusable}
      />
    </div>
  )
}
export default VolumeBar
