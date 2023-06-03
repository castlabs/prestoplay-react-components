import React, { useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledState } from '../react'
import { BasePlayerComponentButtonProps } from '../utils'

import { BaseButton } from './BaseButton'

export interface RateButtonProps extends BasePlayerComponentButtonProps{
  factor?: number
  max?: number
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
  
  function adjustRate() {
    player.rate = Math.min(props.max || 64, Math.max(props.min || 0.5, player.rate * (props.factor || 2)))
  }

  return (
    <BaseButton
      testId="pp-ui-rate-button"
      onClick={adjustRate} disableIcon={props.disableIcon} disabled={!enabled}
      className={`pp-ui-rate pp-ui-rate-${(props.factor || 2) < 1 ? 'fr' : 'ff'} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
}
