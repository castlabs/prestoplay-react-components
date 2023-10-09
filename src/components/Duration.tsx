import React from 'react'

import { useDuration, usePrestoEnabledStateClass } from '../react'
import {
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'
import {
  BaseComponentProps,
} from './types'

const toString = (duration: number) => {
  if (duration === Infinity) {
    return 'Live'
  }
  return timeToString(duration, getMinimalFormat(duration))
}

export interface DurationProps extends BaseComponentProps {
  children?: React.ReactNode
  /**
   * Time in seconds.
   * 
   * By default you should leave this `undefined` and let the component
   * display the real duration of the video.
   */
  seconds?: number
}

/**
 * Duration.
 */
export const Duration = (props: DurationProps) => {
  const duration = useDuration()
  const enabledClass = usePrestoEnabledStateClass()

  return (
    <Label
      testId="pp-ui-duration"
      label={toString(props.seconds ?? duration)}
      className={`pp-ui-label-duration ${enabledClass} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </Label>
  )
}
