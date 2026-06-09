import React from 'react'

import type { BaseComponentProps } from './types'

export interface SpacerProps extends BaseComponentProps {
  children?: React.ReactNode
  onClick?: () => void
}

/**
 * Spacer.
 */
export const Spacer = (props: SpacerProps) => {
  return (
    <div
      onClick={props.onClick}
      onTouchEnd={props.onClick}
      data-testid="pp-ui-spacer"
      className={`pp-ui pp-ui-spacer ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>
  )
}
