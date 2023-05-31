import React, { useDebugValue, useState } from 'react'

import { Player, State } from '../Player'
import { usePrestoUiEvent } from '../react'
import { BasePlayerComponentProps } from '../utils'

export interface BufferingIndicatorProps extends BasePlayerComponentProps{
  player: Player
}

const isBufferingState = (state: State): boolean => {
  return state === State.Preparing || state === State.Buffering
}

const useIsBuffering = (player: Player): boolean => {
  const [buffering, setBuffering] = useState(isBufferingState(player.state))

  usePrestoUiEvent('statechanged', player, (data) => {
    setBuffering(isBufferingState(data.currentState))
  })

  useDebugValue(buffering ? 'buffering' : 'not buffering')

  return buffering
}

export const BufferingIndicator = (props: BufferingIndicatorProps) => {
  const buffering = useIsBuffering(props.player)

  return (
    <div
      className={`pp-ui pp-ui-spinner ${buffering ? 'pp-ui-spinner-loading': ''} ${props.className || ''}`}
      style={props.style}
    >
      <i className={'pp-ui pp-ui-icon'}/>
      {props.children || ''}
    </div>
  )
}

export default BufferingIndicator
