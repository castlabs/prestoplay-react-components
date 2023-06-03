import React, { useContext, useLayoutEffect, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledState, usePrestoUiEvent } from '../react'

import { Slider } from './Slider'

import type { BaseComponentProps } from '../utils'


export interface VolumeBarProps extends BaseComponentProps {
  adjustWhileDragging?: boolean
  notFocusable?: boolean
}

/**
 * Volume bar
 */
export const VolumeBar = (props: VolumeBarProps) => {
  const { player } = useContext(PrestoContext)
  const [progress, setProgress] = useState(100)
  const enabled = usePrestoEnabledState()

  function updateFromPlayer(): number {
    const progress = player.muted ? 0 : (player.volume * 100)
    setProgress(progress)
    return progress
  }

  usePrestoUiEvent('volumechange', () => {
    updateFromPlayer()
  })

  useLayoutEffect(() => {
    updateFromPlayer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  usePrestoUiEvent('statechanged', () => {
    updateFromPlayer()
  })

  const applyValue = (progressValue: number) => {
    setProgress(progressValue)
    player.volume = progressValue / 100.0
  }

  const onKeyDown = async (e: KeyboardEvent) => {
    const presto = await player.presto()
    const current = presto.isMuted() ? 0 : presto.getVolume()
    let targetPosition = current
    
    if (e.key === 'ArrowLeft') {
      targetPosition = Math.max(0, current + (-0.1))
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      targetPosition = Math.min(1, current + (0.1))
      e.preventDefault()
    }

    if (targetPosition !== current) {
      presto.setVolume(targetPosition)
      if (presto.isMuted() && targetPosition > 0) {
        presto.setMuted(false)
      }
    }
  }

  return (
    <div
      data-testid="pp-ui-volumebar"
      className={`pp-ui-volumebar ${props.className || ''}`} style={props.style}>
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
