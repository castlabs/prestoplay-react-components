import React, {useRef, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../../utils";

export interface TimeLeftProps extends BasePlayerComponentProps{
  disableHoveringDisplay?: boolean
}

const TimeLeft = (props: TimeLeftProps) => {
  let [timeLeft, setTimeLeft] = useState("")
  let [isHoveriong, setHovering] = useState(false)
  let hoveringRef = useRef<boolean>()
  hoveringRef.current = isHoveriong

  function setPositionFromPlayer(presto:any) {
    let timeLeft = presto.getDuration() - presto.getPosition();
    setTimeLeft(
      timeToString(
        timeLeft,
        getMinimalFormat(presto.getDuration())))
  }

  usePrestoEvent("timeupdate", props.player, (_, presto) => {
    if (hoveringRef.current) return;
    setPositionFromPlayer(presto);
  })

  usePrestoEvent("hoverposition", props.player, (e, presto) => {
    let hoverPosition = e.detail.hoverPosition
    if (hoverPosition < 0 || props.disableHoveringDisplay) {
      setHovering(false)
      setPositionFromPlayer(presto);
    } else {
      setHovering(true)
      setTimeLeft(
        timeToString(
          presto.getDuration() - hoverPosition,
          getMinimalFormat(presto.getDuration())))
    }
  })

  return (
    <span className={`pp-ui pp-ui-label pp-ui-label-time-left ${props.className}`}>
      {timeLeft}
      {props.children}
    </span>
  )
}

export default TimeLeft
