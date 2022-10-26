import React, {useRef, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../../utils";

export interface CurrentTimeProps extends BasePlayerComponentProps{
  disableHoveringDisplay?: boolean
}

const CurrentTime = (props: CurrentTimeProps) => {
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
  usePrestoEvent("hoverposition", props.player, (e, presto) => {
    let hoverPosition = e.detail.hoverPosition
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
    <span className={`pp-ui pp-ui-label pp-ui-label-current-time ${props.className || ''}`}>
      {currentTime}
      {props.children}
    </span>
  )
}

export default CurrentTime
