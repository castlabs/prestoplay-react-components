import React, {useRef, useState} from "react";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";
import {
  usePrestoEnabledStateClass,
  usePrestoUiEvent
} from "../react";

export interface CurrentTimeProps extends BasePlayerComponentProps {
  disableHoveringDisplay?: boolean
}

export const CurrentTime = (props: CurrentTimeProps) => {
  let [currentTime, setCurrentTime] = useState("")
  let [isHovering, setHovering] = useState(false)
  let hoveringRef = useRef<boolean>()
  let enabledClass = usePrestoEnabledStateClass(props.player);
  hoveringRef.current = isHovering

  const setTime = (time: number) => {
    setCurrentTime(
      timeToString(time, getMinimalFormat(props.player.duration)))
  }

  usePrestoUiEvent("position", props.player, async (position) => {
    if (hoveringRef.current) return;
    setTime(position)
  })

  usePrestoUiEvent("hoverPosition", props.player, async (data) => {
    let hoverPosition = data.position
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
