import React, { useDebugValue, useState } from 'react'

import Player, { BufferingReason, State } from '../Player'
import { usePrestoUiEvent } from '../react'
import { BasePlayerComponentButtonProps } from '../utils'

import BaseButton from './BaseButton'


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
}

type Config = {
  player: Player
  state: State
  resetRate: boolean
  reason?: BufferingReason
}

function isPlayingState(config: Config): boolean {
  const { player, state, resetRate, reason } = config

  if(state == State.Buffering && reason == BufferingReason.Seeking) {
    return player.playing
  }

  if (state != State.Playing) {
    return false
  }

  if (resetRate && player.rate !== 1) {
    return false
  }

  return true
}

const useIsPlaying = (player: Player, resetRate: boolean): boolean => {
  const [isPlaying, setIsPlaying] = useState(isPlayingState({ state: player.state, player, resetRate }))

  usePrestoUiEvent('ratechange', player, () => {
    setIsPlaying(isPlayingState({ state: player.state, player, resetRate }))
  })

  usePrestoUiEvent('statechanged', player, ({ currentState, reason }) => {
    setIsPlaying(isPlayingState({ state: currentState, player, resetRate, reason }))
  })

  useDebugValue(isPlaying ? 'playing' : 'not playing')

  return isPlaying
}

/**
 * The play / pause toggle button.
 *
 * @param props
 * @constructor
 */
export const PlayPauseButton = (props: PlayPauseButtonProps) => {
  const { player, resetRate } = props
  const isPlaying = useIsPlaying(player, resetRate ?? false)

  async function toggle() {
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
    <BaseButton onClick={toggle} disableIcon={props.disableIcon} style={props.style} className={className}>
      {props.children}
    </BaseButton>
  )
}

export default PlayPauseButton
