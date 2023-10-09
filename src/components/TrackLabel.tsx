import React from 'react'

import { classNames } from '../utils'

import type { BaseComponentProps } from './types'

export interface TrackLabelProps extends BaseComponentProps {
  label: string
  selected: boolean
}

export const TrackLabel = (props: TrackLabelProps) => {
  return (
    <div
      data-testid="pp-ui-track-label"
      className={classNames({
        'pp-ui': true,
        'pp-ui-label': true,
        'pp-ui-track-label': true,
        'pp-ui-selected': props.selected,
      }, props.className)}
      style={props.style}
    >
      {props.label}
    </div>
  )
}
