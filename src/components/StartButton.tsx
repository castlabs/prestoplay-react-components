import React, { useContext, useDebugValue, useEffect, useRef, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { State, Player } from '../Player'
import { usePrestoUiEvent } from '../react'
import { focusElement } from '../utils'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'


export interface StartButtonProps extends BasePlayerComponentButtonProps {
  onClick?: () => any | Promise<any>
}

const isVisibleState = (state: State) => {
  return state === State.Idle || state === State.Unset
}

const useVisibility = (player: Player) => {
  const [visible, setVisible] = useState<boolean>(isVisibleState(player.state))

  usePrestoUiEvent('statechanged', () => {
    setVisible(isVisibleState(player.state))
  })

  useDebugValue(visible ? 'visible' : 'hidden')

  return { visible, setVisible }
}

/**
 * Start button.
 * 
 * (Central button to start the video.)
 */
export const StartButton = (props: StartButtonProps) => {
  const { player } = useContext(PrestoContext)
  const { visible, setVisible } = useVisibility(player)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() =>{
    if (ref.current && visible) {
      focusElement(ref.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = async () => {
    if (props.onClick) {
      await props.onClick()
    } else {
      await player.load()
      player.playing = true
    }
    setVisible(false)
    player.surfaceInteraction()
  }

  if (!visible) {
    return null
  }

  return (
    <div
      data-testid="pp-ui-start-button"
      className={`pp-ui-start-button-container ${props.className ?? ''}`} style={props.style}>
      <BaseButton
        onClick={start}
        ref={ref}
        disableIcon={false}
        style={props.style}
        className="pp-ui pp-ui-start-button" />
    </div>
  )
}
