import React, { useContext, useRef, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import {
  usePrestoEnabledState,
  usePrestoUiEvent,
} from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'

export interface MenuSlideinToggleProps extends BasePlayerComponentButtonProps {
  children?: React.ReactNode
}

/**
 * Menu slide-in toggle button.
 * A button that shows a slide-in menu.
 */
export const MenuSlideinToggleButton = (props: MenuSlideinToggleProps) => {
  const { player } = useContext(PrestoContext)
  const [isVisible, setVisible] = useState(false)
  const enabled = usePrestoEnabledState()
  const ref = useRef<HTMLButtonElement>(null)

  function toggle(event: React.UIEvent) {
    setVisible(!isVisible)
    player.slideInMenuVisible = !isVisible
    event.stopPropagation()
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
      testId="pp-ui-slideinmenu-toggle"
      onClick={toggle}
      disableIcon={false}
      disabled={!enabled}
      className={`pp-ui-slideinmenu-toggle ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
}
