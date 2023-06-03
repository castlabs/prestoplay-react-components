import React from 'react'

import type { BaseComponentProps } from '../utils'

export interface VerticalBarProps extends BaseComponentProps{
  children?: React.ReactNode
}

/**
 * Vertical bar.
 */
export const VerticalBar = (props: VerticalBarProps) => {
  return (
    <div
      data-testid="pp-ui-vertical-bar"
      className={`pp-ui pp-ui-vertical-bar ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>
  )
}
