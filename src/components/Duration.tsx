import React, {useState} from "react";
import {
  BasePlayerComponentProps,
  getMinimalFormat,
  timeToString
} from "../utils";
import Label from "./Label";
import {usePrestoEnabledStateClass, usePrestoUiEvent} from "../react";

export interface DurationProps extends BasePlayerComponentProps{
}

export const Duration = (props: DurationProps) => {
  let [duration, setDuration] = useState("")
  let enabledClass = usePrestoEnabledStateClass(props.player);


  usePrestoUiEvent("durationchange", props.player, (duration) => {
    if(duration == Infinity) {
      setDuration("Live")
    } else {
      setDuration(timeToString(duration, getMinimalFormat(duration)))
    }
  })

  return (
    <Label label={duration} children={props.children} className={`pp-ui-label-duration ${enabledClass} ${props.className || ''}`}/>
  )
}

export default Duration
