import React, {
  forwardRef,
  useContext,
  useRef,
  useState,
} from 'react'

import { PrestoContext } from '../context/PrestoContext'
import {
  usePrestoEnabledState,
  usePrestoUiEvent,
} from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'


export interface SettingsButtonProps extends BasePlayerComponentButtonProps {
  children?: React.ReactNode
}

/**
 * @deprecated This is not used, neither exported
 */
export const SettingsButton = forwardRef((props: SettingsButtonProps) => {
  const { player } = useContext(PrestoContext)
  const [isVisible, setVisible] = useState(false)
  const enabled = usePrestoEnabledState()
  const ref = useRef<HTMLButtonElement>(null)

  function toggle(event: React.UIEvent) {
    setVisible(!isVisible)
    player.slideInMenuVisible = !isVisible

    event.stopPropagation()
    event.preventDefault()

    if (ref.current && !isVisible) {
      ref.current.blur()
    }
  }

  usePrestoUiEvent('slideInMenuVisible', (visible) => {
    setVisible(visible)
  })

  return (
    <BaseButton
      ref={ref}
      testId="pp-ui-settings-button"
      onClick={toggle}
      disableIcon={false}
      disabled={!enabled}
      className={`pp-ui-settings-button ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
})

SettingsButton.displayName = 'SettingsButton'
