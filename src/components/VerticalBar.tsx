import React from 'react'

import type { BaseComponentProps } from './types'

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

export const VerticalBarStory = (props: VerticalBarProps) => {
  const style = {
    color: 'grey',
    border: '1px dashed grey',
    padding: '0 20px',
  }
  return (
    <VerticalBar {...props}>
      <div style={style}>Item 1</div>
      <div style={style}>Item 2</div>
      <div style={style}>Item 3</div>
    </VerticalBar>
  )
}
