import React, {useEffect, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../../utils";

export interface DurationProps extends BasePlayerComponentProps{
}

const Duration = (props: DurationProps) => {
  let [duration, setDuration] = useState("")

  usePrestoEvent("durationchange", props.player, (_, presto) => {
    let dur = presto.getDuration();
    setDuration(timeToString(dur, getMinimalFormat(dur)))
  })

  return (
    <span className={`pp-ui pp-ui-label pp-ui-label-duration ${props.className || ''}`}>
      {duration}
      {props.children}
    </span>
  )
}

export default Duration
