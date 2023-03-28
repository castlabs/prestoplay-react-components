import React, { ForwardedRef, forwardRef } from 'react'

import { BaseComponentProps } from '../utils'

/**
 * The base button properties
 */
export interface BaseButtonProps extends BaseComponentProps {
  /**
   * The click callback
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown
  /**
   * By default, the base button has an icon. If no icon is set, for instance
   * through the css style, use this property to disable icon rendering and
   * turn this into a text based button.
   */
  disableIcon?: boolean
  /**
   * Indicate that the button is disabled
   */
  disabled?: boolean
}

/**
 * Basic button that exposes an onClick callback. The base button, by default,
 * assumes that it will have an icon. Of that is not the case, adjust the
 * `disableIcon` property.
 *
 * @param props
 * @constructor
 */
export const BaseButton = forwardRef((props: BaseButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  const generateIcon = () => props.disableIcon ? undefined :
    <i className={'pp-ui pp-ui-icon'}/>

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled) {
      return
    }

    if (props.onClick) {
      props.onClick(e)
      e.preventDefault()
    }
  }

  return (
    <button type="button" ref={ref}
      tabIndex={props.disabled ? -1 : 0}
      style={props.style}
      className={`pp-ui pp-ui-button ${props.disableIcon ? 'pp-ui-button-no-icon': ''} `
              +`${props.disabled ? 'pp-ui-disabled' : 'pp-ui-enabled'} ${props.className ?? ''}`}
      onClick={click}>
      {generateIcon()}
      {props.children}
    </button>
  )
})

export default BaseButton
