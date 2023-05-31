import React, { createRef, useState } from 'react'

import {
  usePrestoEnabledState,
  usePrestoUiEvent,
} from '../react'
import { BasePlayerComponentButtonProps } from '../utils'

import { BaseButton } from './BaseButton'

export type MenuSlideinToggleProps = BasePlayerComponentButtonProps

export const MenuSlideinToggleButton = (props: MenuSlideinToggleProps) => {
  const [isVisible, setVisible] = useState(false)
  const enabled = usePrestoEnabledState(props.player)
  const ref = createRef<HTMLButtonElement>()

  function toggle(event: React.MouseEvent) {
    setVisible(!isVisible)
    props.player.slideInMenuVisible = !isVisible
    event.stopPropagation()
    if (ref.current && !isVisible) {
      ref.current.blur()
    }
  }

  usePrestoUiEvent('slideInMenuVisible', props.player, (visible) => {
    setVisible(visible)
  })

  return (
    <BaseButton onClick={toggle} disableIcon={false} disabled={!enabled} ref={ref}
      className={`pp-ui-slideinmenu-toggle ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  )
}
