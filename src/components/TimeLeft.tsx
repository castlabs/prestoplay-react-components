import React, { useRef, useState } from 'react'

import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'

export interface TimeLeftProps extends BasePlayerComponentProps {
  disableHoveringDisplay?: boolean
}

export const TimeLeft = (props: TimeLeftProps) => {
  const [timeLeft, setTimeLeft] = useState('')
  const [isHovering, setHovering] = useState(false)
  const enabledClass = usePrestoEnabledStateClass(props.player)
  const hoveringRef = useRef<boolean>()
  hoveringRef.current = isHovering

  function setPositionFromPlayer(position: number) {
    if (props.player.live) {
      setTimeLeft('Live')
      return
    }
    let duration = props.player.duration
    if (duration === Infinity) {
      duration = 0
    }
    const timeLeft = Math.max(0, duration - position)
    setTimeLeft('-' + timeToString(timeLeft, getMinimalFormat(duration)))
  }

  usePrestoUiEvent('position', props.player, (position) => {
    if (hoveringRef.current) {return}
    setPositionFromPlayer(position)
  })

  usePrestoUiEvent('hoverPosition', props.player, data => {
    if (data.position < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(props.player.position)
    } else {
      setHovering(true)
      setPositionFromPlayer(data.position)
    }
  })

  return (
    <Label
      label={timeLeft}
      className={`pp-ui-label-time-left ${enabledClass} ${props.className || ''}`}
    >
      {props.children}
    </Label>
  )
}

export default TimeLeft
