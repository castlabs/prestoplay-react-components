import React, { FC } from 'react'

import { BaseComponentProps } from '../utils'

export interface LabelProps extends BaseComponentProps {
  label?: string
}

export const Label: FC<LabelProps> = props => {
  return (
    <span className={`pp-ui pp-ui-label ${props.className || ''}`}>
      {props.label || ''}
      {props.children}
    </span>
  )
}
