import React, { useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledState } from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'


export interface SeekButtonProps extends BasePlayerComponentButtonProps {
  /**
   * The number of seconds to seek forward, if this number is negative
   * the button will seek backwards.
   */
  seconds: number
  children?: React.ReactNode
  enabled?: boolean
}

/**
 * Seek button.
 * This button is for seeking/jumping forward or backward in the video.
 */
export const SeekButton = (props: SeekButtonProps) => {
  const { player } = useContext(PrestoContext)
  const seek = () => player.position += props.seconds
  const enabled = usePrestoEnabledState()

  if (!props.seconds) {return <></>}

  return (
    <BaseButton
      testId="pp-ui-seek-button"
      onClick={seek}
      disableIcon={props.disableIcon}
      disabled={props.enabled === false || !enabled}
      className={`pp-ui-seek pp-ui-seek-${props.seconds < 0 ? 'back' : 'forward'} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
}
