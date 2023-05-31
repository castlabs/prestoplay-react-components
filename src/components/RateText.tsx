import React, { useState } from 'react'

import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'
import { BasePlayerComponentProps } from '../utils'

import { Label } from './Label'

export type RateTextProps = BasePlayerComponentProps

export const RateText = (props: RateTextProps) => {
  const [rate, setRate] = useState(1)
  const enabledClass = usePrestoEnabledStateClass(props.player)

  usePrestoUiEvent('ratechange', props.player, (rate) => {
    if (rate !== 0) {
      setRate(rate)
    }
  })

  return (
    <Label
      label={`x${rate}`}
      className={`pp-ui-label-rate ${enabledClass} ${props.className || ''}`}
    >
      {props.children}
    </Label>
  )
}

export default RateText
