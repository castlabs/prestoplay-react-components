import React, { useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { useIsPlaying } from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'



/**
 * Props for the play/pause toggle button
 */
export interface PlayPauseButtonProps extends BasePlayerComponentButtonProps {
  /**
   * If set to true, the button will change to the non-playing state if the
   * playback rate is not 1 and will, when clicked, change the playback rate
   * back to 1.
   */
  resetRate?: boolean
  children?: React.ReactNode
}

/**
 * The play / pause toggle button.
 */
export const PlayPauseButton = (props: PlayPauseButtonProps) => {
  const { resetRate } = props
  const { player } = useContext(PrestoContext)
  const isPlaying = useIsPlaying(resetRate ?? false)

  const toggle = () => {
    if (resetRate && player.rate !== 1) {
      player.rate = 1
      player.playing = true
      return
    }

    player.playing = !player.playing
  }

  const className = `pp-ui-playpause-toggle pp-ui-playpause-toggle-${isPlaying ? 'pause' : 'play'}`
    +` ${props.className || ''}`

  return (
    <BaseButton
      testId="pp-ui-playpause-toggle"
      onClick={toggle}
      disableIcon={props.disableIcon} style={props.style} className={className}>
      {props.children}
    </BaseButton>
  )
}
