import React, { CSSProperties } from 'react'

import type { BaseComponentProps } from './types'

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

export const HorizontalBarStory = (props: HorizontalBarProps) => {
  const style = {
    border: '1px dashed white',
    padding: '0 20px',
  }
  return (
    <HorizontalBar {...props}>
      <div style={style}>Item 1</div>
      <div style={style}>Item 2</div>
      <div style={style}>Item 3</div>
    </HorizontalBar>
  )
}
