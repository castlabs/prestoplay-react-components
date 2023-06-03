import React, { useState } from 'react'

import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'
import {
  BaseComponentProps,
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'

export interface DurationProps extends BaseComponentProps {
  children?: React.ReactNode
}

/**
 * Duration.
 */
export const Duration = (props: DurationProps) => {
  const [duration, setDuration] = useState('')
  const enabledClass = usePrestoEnabledStateClass()

  usePrestoUiEvent('durationchange', (duration) => {
    if (duration === Infinity) {
      setDuration('Live')
    } else {
      setDuration(timeToString(duration, getMinimalFormat(duration)))
    }
  })

  return (
    <Label
      testId="pp-ui-duration"
      label={duration}
      className={`pp-ui-label-duration ${enabledClass} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </Label>
  )
}
