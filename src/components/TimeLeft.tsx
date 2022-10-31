import React, {useRef, useState} from "react";
import {usePrestoEvent, usePrestoUiEvent} from "../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";

export interface TimeLeftProps extends BasePlayerComponentProps{
  disableHoveringDisplay?: boolean
}

export const TimeLeft = (props: TimeLeftProps) => {
  let [timeLeft, setTimeLeft] = useState("")
  let [isHovering, setHovering] = useState(false)
  let hoveringRef = useRef<boolean>()
  hoveringRef.current = isHovering

  function setPositionFromPlayer(presto:any) {
    if(presto.isLive()) {
      setTimeLeft("Live")
      return
    }
    let timeLeft = Math.max(0, presto.getDuration() - presto.getPosition());
    setTimeLeft(
      "-" + timeToString(
        timeLeft,
        getMinimalFormat(presto.getDuration())))
  }

  usePrestoEvent("timeupdate", props.player, (_, presto) => {
    if (hoveringRef.current) return;
    setPositionFromPlayer(presto);
  })

  usePrestoUiEvent("hoverPosition", props.player, async data => {
    let presto = await props.player.presto();
    if (data.position < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(presto);
    } else {
      setHovering(true)
      if(presto.isLive()) {
        setTimeLeft("Live")
      } else {
        setTimeLeft(
          "-" + timeToString(
            Math.max(0, presto.getDuration() - data.position),
            getMinimalFormat(presto.getDuration())))
      }
    }
  })

  return (
    <Label label={timeLeft} children={props.children} className={`pp-ui-label-time-left ${props.className || ''}`}/>
  )
}

export default TimeLeft
