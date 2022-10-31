import React, {useEffect, useState} from "react";
import {Player, usePrestoEvent} from "../Player";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";

export interface DurationProps extends BasePlayerComponentProps{
}

export const Duration = (props: DurationProps) => {
  let [duration, setDuration] = useState("")

  usePrestoEvent("durationchange", props.player, (_, presto) => {
    let dur = presto.getDuration();
    if(presto.isLive()) {
      setDuration("Live")
    } else {
      setDuration(timeToString(dur, getMinimalFormat(dur)))
    }
  })

  return (
    <Label label={duration} children={props.children} className={`pp-ui-label-duration ${props.className || ''}`}/>
  )
}

export default Duration
