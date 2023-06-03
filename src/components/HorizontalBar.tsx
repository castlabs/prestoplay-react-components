import React, { CSSProperties } from 'react'

import type { BaseComponentProps } from '../utils'

export interface HorizontalBarProps extends BaseComponentProps{
  style?: CSSProperties
  children?: React.ReactNode
}

/**
 * Horizontal bar.
 */
export const HorizontalBar = (props: HorizontalBarProps) => {
  return (
    <div
      data-testid="pp-ui-horizontal-bar" 
      className={`pp-ui pp-ui-row pp-ui-horizontal-bar ${props.className || ''}`} style={props.style}
    >
      {props.children}
    </div>
  )
}
