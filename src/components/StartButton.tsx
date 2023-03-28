import React, { createRef, useDebugValue, useEffect, useState } from 'react'

import { State, Player } from '../Player'
import { usePrestoUiEvent } from '../react'
import { BasePlayerComponentButtonProps, focusElement } from '../utils'

import BaseButton from './BaseButton'

export interface StartButtonProps extends BasePlayerComponentButtonProps {
  onClick?: () => Promise<void>
}

const isVisibleState = (state: State) => {
  return state == State.Idle || state == State.Unset
}

const useVisibility = (player: Player) => {
  const [visible, setVisible] = useState<boolean>(isVisibleState(player.state))

  usePrestoUiEvent('statechanged', player, () => {
    setVisible(isVisibleState(player.state))
  })

  useDebugValue(visible ? 'visible' : 'hidden')

  return { visible, setVisible }
}

export const StartButton = (props: StartButtonProps) => {
  const { visible, setVisible } = useVisibility(props.player)
  const ref = createRef<HTMLButtonElement>()

  useEffect(() =>{
    if(ref.current && visible) {
      focusElement(ref.current)
    }
  }, [ref])

  const start = async () => {
    if (props.onClick) {
      await props.onClick()
    } else {
      await props.player.load()
      props.player.playing = true
    }
    setVisible(false)
    props.player.surfaceInteraction()
  }

  if (!visible) {
    return null
  }

  return (
    <div className="pp-ui-start-button-container">
      <BaseButton onClick={start} ref={ref}
        disableIcon={false}
        style={props.style}
        className={`pp-ui pp-ui-start-button ${props.className}`}/>
    </div>
  )
}

export default StartButton
