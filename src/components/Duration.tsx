import React, { useState } from 'react'

import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'

export type DurationProps = BasePlayerComponentProps

export const Duration = (props: DurationProps) => {
  const [duration, setDuration] = useState('')
  const enabledClass = usePrestoEnabledStateClass(props.player)

  usePrestoUiEvent('durationchange', props.player, (duration) => {
    if (duration === Infinity) {
      setDuration('Live')
    } else {
      setDuration(timeToString(duration, getMinimalFormat(duration)))
    }
  })

  return (
    <Label
      label={duration}
      className={`pp-ui-label-duration ${enabledClass} ${props.className || ''}`}
    >
      {props.children}
    </Label>
  )
}

export default Duration
