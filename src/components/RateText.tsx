import React, { useState } from 'react'

import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'

import { Label } from './Label'

import type { BaseComponentProps } from './types'


export interface RateTextProps extends BaseComponentProps {
  children?: React.ReactNode
  /**
   * Playback rate.
   * 
   * By default you should leave this `undefined` and let the component
   * display the real playback rate of the video.
   */
  rate?: number
}

/**
 * A component that displays the current playback rate.
 */
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
      label={`x${props.rate ?? rate}`}
      className={`pp-ui-label-rate ${enabledClass} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </Label>
  )
}
