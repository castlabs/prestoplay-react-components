import React, {useState} from "react";
import {BasePlayerComponentProps} from "../utils";
import Label from "./Label";
import {usePrestoEnabledStateClass, usePrestoUiEvent} from "../react";

export interface RateTextProps extends BasePlayerComponentProps{
}

export const RateText = (props: RateTextProps) => {
  let [rate, setRate] = useState(1);
  let enabledClass = usePrestoEnabledStateClass(props.player);

  usePrestoUiEvent('ratechange', props.player, (rate) => {
    if (rate != 0) {
      setRate(rate)
    }
  })

  return (
    <Label label={`x${rate}`} children={props.children} className={`pp-ui-label-rate ${enabledClass} ${props.className || ''}`}/>
  );
}

export default RateText
