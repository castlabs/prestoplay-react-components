import React, { useContext, useRef, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledStateClass, usePrestoUiEvent } from '../react'
import {
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'

import type { BaseComponentProps } from './types'

export interface TimeLeftProps extends BaseComponentProps {
  disableHoveringDisplay?: boolean
  children?: React.ReactNode
}

export const TimeLeft = (props: TimeLeftProps) => {
  const { player } = useContext(PrestoContext)
  const [timeLeft, setTimeLeft] = useState('')
  const [isHovering, setHovering] = useState(false)
  const enabledClass = usePrestoEnabledStateClass()
  const hoveringRef = useRef<boolean>()
  hoveringRef.current = isHovering

  function setPositionFromPlayer(position: number) {
    if (player.live) {
      setTimeLeft('Live')
      return
    }
    let duration = player.duration
    if (duration === Infinity) {
      duration = 0
    }
    const timeLeft = Math.max(0, duration - position)
    setTimeLeft('-' + timeToString(timeLeft, getMinimalFormat(duration)))
  }

  usePrestoUiEvent('position', (position) => {
    if (hoveringRef.current) {return}
    setPositionFromPlayer(position)
  })

  usePrestoUiEvent('hoverPosition', event => {
    if (!event || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(player.position)
    } else {
      setHovering(true)
      setPositionFromPlayer(event.position)
    }
  }, [props.disableHoveringDisplay])

  return (
    <Label
      data-testid="pp-ui-label-time-left"
      label={timeLeft}
      className={`pp-ui-label-time-left ${enabledClass} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </Label>
  )
}
