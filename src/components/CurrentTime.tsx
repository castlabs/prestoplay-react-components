import React, { useContext, useRef, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import {
  usePrestoEnabledStateClass,
  usePrestoUiEvent,
} from '../react'
import {
  getMinimalFormat,
  timeToString,
} from '../utils'

import { Label } from './Label'

import type {
  BaseComponentProps,
} from './types'


export interface CurrentTimeProps extends BaseComponentProps {
  disableHoveringDisplay?: boolean
  children?: React.ReactNode
  /**
   * Time in seconds.
   * 
   * By default you should leave this `undefined` and let the component
   * display the real the current time of the player.
   */
  seconds?: number
}

/**
 * Current time.
 */
export const CurrentTime = (props: CurrentTimeProps) => {
  const { player } = useContext(PrestoContext)
  const [currentTime, setCurrentTime] = useState(timeToString(props.seconds ?? 0, getMinimalFormat(0)))
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
    if (!event || props.disableHoveringDisplay) {
      setHovering(false)
      setTime(player.position)
    } else {
      setHovering(true)
      setTime(event.position)
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
