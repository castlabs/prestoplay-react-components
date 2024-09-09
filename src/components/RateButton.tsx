import React, { useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledState } from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'


export interface RateButtonProps extends BasePlayerComponentButtonProps {
  /**
   * Playback rate/speed factor.
   *
   * e.g. 2 to play twice as fast, or 0.5 to play half as fast.
   *
   * Defaults to 2.
   */
  factor?: number
  /**
   * Maximum allowed playback rate.
   *
   * Defaults to 64.
   */
  max?: number
  /**
   * Minimum allowed playback rate.
   *
   * Defaults to 0.5.
   */
  min?: number
  children?: React.ReactNode
}

/**
 * Rate button.
 * A button to change playback rate/speed; to speed up or slow down video playback.
 */
export const RateButton = (props: RateButtonProps) => {
  const { player } = useContext(PrestoContext)
  const enabled = usePrestoEnabledState()

  const max = props.max ?? 64
  const min = props.min ?? 0.5
  const factor = props.factor ?? 2

  function adjustRate() {
    const newRate = player.rate * factor
    player.rate = Math.min(max, Math.max(min, newRate))
  }

  return (
    <BaseButton
      testId="pp-ui-rate-button"
      onClick={adjustRate}
      disableIcon={props.disableIcon}
      disabled={!enabled}
      className={`pp-ui-rate pp-ui-rate-${factor < 1 ? 'fr' : 'ff'} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
}
