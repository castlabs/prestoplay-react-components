import React, { useContext, useRef, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import {
  usePrestoEnabledStateClass,
  usePrestoUiEvent,
} from '../react'
import {
  BaseComponentProps,
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'

export interface CurrentTimeProps extends BaseComponentProps {
  disableHoveringDisplay?: boolean
  children?: React.ReactNode
}

/**
 * Current time.
 */
export const CurrentTime = (props: CurrentTimeProps) => {
  const { player } = useContext(PrestoContext)
  const [currentTime, setCurrentTime] = useState('')
  const [isHovering, setHovering] = useState(false)
  const hoveringRef = useRef<boolean>()
  const enabledClass = usePrestoEnabledStateClass()
  hoveringRef.current = isHovering

  const setTime = (time: number) => {
    setCurrentTime(
      timeToString(time, getMinimalFormat(player.duration)))
  }

  usePrestoUiEvent('position', (position) => {
    if (hoveringRef.current) {return}
    setTime(position)
  })

  usePrestoUiEvent('hoverPosition', (event) => {
    const hoverPosition = event.position
    if (hoverPosition < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setTime(player.position)
    } else {
      setHovering(true)
      setTime(hoverPosition)
    }
  }, [props.disableHoveringDisplay]) 

  return (
    <Label
      testId="pp-ui-current-time"
      label={currentTime}
      className={`pp-ui-label-current-time ${enabledClass} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </Label>
  )
}
