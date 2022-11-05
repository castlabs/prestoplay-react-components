import React, {useRef, useState} from "react";
import {Player, usePrestoEvent, usePrestoUiEvent} from "../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";

export interface CurrentTimeProps extends BasePlayerComponentProps {
  disableHoveringDisplay?: boolean
}

export const CurrentTime = (props: CurrentTimeProps) => {
  let [currentTime, setCurrentTime] = useState("")
  let [isHovering, setHovering] = useState(false)
  let hoveringRef = useRef<boolean>()
  hoveringRef.current = isHovering

  function setPositionFromPlayer(position: number) {
    setCurrentTime(
      timeToString(position, getMinimalFormat(props.player.duration)))
  }

  usePrestoUiEvent("position", props.player, async (position) => {
    if (hoveringRef.current) return;
    setPositionFromPlayer(position);
  })

  usePrestoUiEvent("hoverPosition", props.player, async (data) => {
    let hoverPosition = data.position
    if (hoverPosition < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(props.player.position);
    } else {
      setHovering(true)
      setCurrentTime(
        timeToString(hoverPosition, getMinimalFormat(props.player.duration)))
    }
  })

  return (
    <Label label={currentTime} children={props.children}
           className={`pp-ui-label-current-time ${props.className || ''}`}/>
  )
}

export default CurrentTime
