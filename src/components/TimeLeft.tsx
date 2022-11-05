import React, {useRef, useState} from "react";
import {usePrestoEvent, usePrestoUiEvent} from "../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";

export interface TimeLeftProps extends BasePlayerComponentProps {
  disableHoveringDisplay?: boolean
}

export const TimeLeft = (props: TimeLeftProps) => {
  let [timeLeft, setTimeLeft] = useState("")
  let [isHovering, setHovering] = useState(false)
  let hoveringRef = useRef<boolean>()
  hoveringRef.current = isHovering

  function setPositionFromPlayer(position: number) {
    if (props.player.live) {
      setTimeLeft("Live")
      return
    }
    const duration = props.player.duration
    const timeLeft = Math.max(0, duration - position);
    setTimeLeft("-" + timeToString(timeLeft, getMinimalFormat(duration)))
  }

  usePrestoUiEvent("position", props.player, async (position) => {
    if (hoveringRef.current) return;
    setPositionFromPlayer(position);
  })

  usePrestoUiEvent("hoverPosition", props.player, async data => {
    if (data.position < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(props.player.position);
    } else {
      setHovering(true)
      setPositionFromPlayer(data.position)
    }
  })

  return (
    <Label label={timeLeft} children={props.children}
           className={`pp-ui-label-time-left ${props.className || ''}`}/>
  )
}

export default TimeLeft
