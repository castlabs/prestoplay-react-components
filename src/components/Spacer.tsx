import React from 'react'

import type { BaseComponentProps } from '../utils'

export interface SpacerProps extends BaseComponentProps {
  children?: React.ReactNode
}

/**
 * Spacer.
 */
export const Spacer = (props: SpacerProps) => {
  return (
    <div
      data-testid="pp-ui-spacer"
      className={`pp-ui pp-ui-spacer ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>
  )
}
