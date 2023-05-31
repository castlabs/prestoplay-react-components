import React, {
  forwardRef,
  useRef,
  useState,
} from 'react'

import {
  usePrestoEnabledState,
  usePrestoUiEvent,
} from '../react'
import { BasePlayerComponentButtonProps } from '../utils'

import { BaseButton } from './BaseButton'

export type SettingsButtonProps = BasePlayerComponentButtonProps

/**
 * @deprecated This is not used, neither exported
 */
export const SettingsButton = forwardRef((props: SettingsButtonProps) => {
  const [isVisible, setVisible] = useState(false)
  const enabled = usePrestoEnabledState(props.player)
  const ref = useRef<HTMLButtonElement>(null)

  function toggle(event: React.MouseEvent) {
    setVisible(!isVisible)
    props.player.slideInMenuVisible = !isVisible

    event.stopPropagation()
    event.preventDefault()

    if (ref.current && !isVisible) {
      ref.current.blur()
    }
  }

  usePrestoUiEvent('slideInMenuVisible', props.player, (visible) => {
    setVisible(visible)
  })

  return (
    <BaseButton onClick={toggle} disableIcon={false} disabled={!enabled} ref={ref}
      className={`pp-ui-settings-button ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  )
})

SettingsButton.displayName = 'SettingsButton'
