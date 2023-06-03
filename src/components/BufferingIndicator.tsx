import React, { useContext, useDebugValue, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { State } from '../Player'
import { usePrestoUiEvent } from '../react'

import type { BaseComponentProps } from '../utils'

export interface BufferingIndicatorProps extends BaseComponentProps {
  children?: React.ReactNode
}

const isBufferingState = (state: State): boolean => {
  return state === State.Preparing || state === State.Buffering
}

const useIsBuffering = (): boolean => {
  const { player } = useContext(PrestoContext)
  const [buffering, setBuffering] = useState(isBufferingState(player.state))

  usePrestoUiEvent('statechanged', (event) => {
    setBuffering(isBufferingState(event.currentState))
  })

  useDebugValue(buffering ? 'buffering' : 'not buffering')

  return buffering
}

/**
 * Buffering indicator.
 * An animated spinner icon, that indicates a buffering state of the player.
 */
export const BufferingIndicator = (props: BufferingIndicatorProps) => {
  const buffering = useIsBuffering()

  return (
    <div
      data-testid="pp-ui-buffering-indicator" 
      className={`pp-ui pp-ui-spinner ${buffering ? 'pp-ui-spinner-loading': ''} ${props.className || ''}`}
      style={props.style}
    >
      <i className={'pp-ui pp-ui-icon'}/>
      {props.children}
    </div>
  )
}
