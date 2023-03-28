import React, { useRef, useState } from 'react'

import {
  usePrestoEnabledStateClass,
  usePrestoUiEvent,
} from '../react'
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString,
} from '../utils'

import Label from './Label'

export interface CurrentTimeProps extends BasePlayerComponentProps {
  disableHoveringDisplay?: boolean
}

export const CurrentTime = (props: CurrentTimeProps) => {
  const [currentTime, setCurrentTime] = useState('')
  const [isHovering, setHovering] = useState(false)
  const hoveringRef = useRef<boolean>()
  const enabledClass = usePrestoEnabledStateClass(props.player)
  hoveringRef.current = isHovering

  const setTime = (time: number) => {
    setCurrentTime(
      timeToString(time, getMinimalFormat(props.player.duration)))
  }

  usePrestoUiEvent('position', props.player, async (position) => {
    if (hoveringRef.current) {return}
    setTime(position)
  })

  usePrestoUiEvent('hoverPosition', props.player, async (data) => {
    const hoverPosition = data.position
    if (hoverPosition < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setTime(props.player.position)
    } else {
      setHovering(true)
      setTime(hoverPosition)
    }
  })

  return (
    <Label label={currentTime} children={props.children}
      className={`pp-ui-label-current-time ${enabledClass} ${props.className || ''}`}/>
  )
}

export default CurrentTime
