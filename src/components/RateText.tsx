import React, { useState } from 'react'

import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'

import { Label } from './Label'

import type { BaseComponentProps } from '../utils'


export interface RateTextProps extends BaseComponentProps {
  children?: React.ReactNode
}

export const RateText = (props: RateTextProps) => {
  const [rate, setRate] = useState(1)
  const enabledClass = usePrestoEnabledStateClass()

  usePrestoUiEvent('ratechange', (rate) => {
    if (rate !== 0) {
      setRate(rate)
    }
  })

  return (
    <Label
      testId="pp-ui-rate"
      label={`x${rate}`}
      className={`pp-ui-label-rate ${enabledClass} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </Label>
  )
}
