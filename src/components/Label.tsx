import React, { FC } from 'react'

import type { BaseComponentProps } from '../utils'

export interface LabelProps extends BaseComponentProps {
  label?: string
  children?: React.ReactNode
  testId?: string
}

/**
 * Label.
 */
export const Label: FC<LabelProps> = props => {
  return (
    <span data-testid={props.testId} className={`pp-ui pp-ui-label ${props.className || ''}`} style={props.style}>
      {props.label || ''}
      {props.children}
    </span>
  )
}
