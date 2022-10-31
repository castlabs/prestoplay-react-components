import React, {useRef, useState} from "react";
import {Player, usePrestoEvent, usePrestoUiEvent} from "../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";

export interface CurrentTimeProps extends BasePlayerComponentProps{
  disableHoveringDisplay?: boolean
}

export const CurrentTime = (props: CurrentTimeProps) => {
  let [currentTime, setCurrentTime] = useState("")
  let [isHovering, setHovering] = useState(false)
  let hoveringRef = useRef<boolean>()
  hoveringRef.current = isHovering

  function setPositionFromPlayer(presto:any) {
    setCurrentTime(
      timeToString(
        presto.getPosition(),
        getMinimalFormat(presto.getDuration())))
  }

  usePrestoEvent("timeupdate", props.player, (_, presto) => {
    if (hoveringRef.current) return;
    setPositionFromPlayer(presto);
  })
  usePrestoUiEvent("hoverPosition", props.player, async (data) => {
    let presto = await props.player.presto()
    let hoverPosition = data.position
    if (hoverPosition < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(presto);
    } else {
      setHovering(true)
      setCurrentTime(
        timeToString(
          hoverPosition,
          getMinimalFormat(presto.getDuration())))
    }
  })

  return (
    <Label label={currentTime} children={props.children} className={`pp-ui-label-current-time ${props.className || ''}`}/>
  )
}

export default CurrentTime
