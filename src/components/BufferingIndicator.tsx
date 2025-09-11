import React, { useContext, useDebugValue, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { useAd } from '../hooks/hooks'
import { State } from '../Player'
import { usePrestoUiEvent } from '../react'

import type { BaseComponentProps } from './types'

export interface BufferingIndicatorProps extends BaseComponentProps {
  children?: React.ReactNode
  /**
   * Whether the buffering indicator should be visible or not.
   *
   * By default you should leave this `undefined` and let the buffering indicator
   * automatically react to the current state of the player.
   */
  visible?: boolean
}

const isBufferingState = (state: State): boolean => {
  return state === State.Preparing || state === State.Buffering
}

const useIsBuffering = (): boolean => {
  const { player } = useContext(PrestoContext)
  const [buffering, setBuffering] = useState(isBufferingState(player?.state ?? State.Idle))
  const ad = useAd()

  usePrestoUiEvent('statechanged', (event) => {
    setBuffering(isBufferingState(event.currentState))
  })

  useDebugValue(buffering ? 'buffering' : 'not buffering')

  return buffering && !ad
}

/**
 * Buffering indicator.
 * An animated spinner icon, that indicates a buffering state of the player.
 */
export const BufferingIndicator = (props: BufferingIndicatorProps) => {
  const buffering = useIsBuffering()
  const isBuffering = props.visible ?? buffering

  return (
    <div
      data-testid="pp-ui-buffering-indicator" 
      className={`pp-ui pp-ui-spinner ${isBuffering ? 'pp-ui-spinner-loading': ''} ${props.className || ''}`}
      style={props.style}
    >
      <i className={'pp-ui pp-ui-icon'}/>
      {props.children}
    </div>
  )
}
