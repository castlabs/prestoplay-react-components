import React, {useEffect, useState} from "react";
import {Player, usePrestoEvent, usePrestoUiEvent} from "../Player";
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

  usePrestoUiEvent("durationchange", props.player, (duration) => {
    if(duration == Infinity) {
      setDuration("Live")
    } else {
      setDuration(timeToString(duration, getMinimalFormat(duration)))
    }
  })

  return (
    <Label label={duration} children={props.children} className={`pp-ui-label-duration ${props.className || ''}`}/>
  )
}

export default Duration
