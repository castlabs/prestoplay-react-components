import { CSSProperties } from 'react'

/**
 * Base properties for components created by this library
 */
export interface BaseComponentProps {
  /**
   * A component's className. This is passed as the `class` attribute
   * to the top level HTML element rendered by this component.
   */
  className?: string
  /**
   * A component's style. This is passed to the top level HTML element rendered
   * by this component.
   */
  style?: CSSProperties
}

/**
 * Base properties interface for button components that interact with a player.
 */
export interface BasePlayerComponentButtonProps extends BaseComponentProps {
  /**
   * Buttons, by default assume they have an icon. Use this to disable the icon
   * and turn the button into a text based button.
   */
  disableIcon?: boolean
}
