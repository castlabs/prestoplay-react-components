import React, {useState} from "react";
import {usePrestoEvent, usePrestoUiEvent} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentProps} from "../utils";
import Label from "./Label";

export interface RateTextProps extends BasePlayerComponentProps{
}

export const RateText = (props: RateTextProps) => {
  let [rate, setRate] = useState(1);

  usePrestoUiEvent('ratechange', props.player, (rate) => {
    if (rate != 0) {
      setRate(rate)
    }
  })

  return (
    <Label label={`x${rate}`} children={props.children} className={`pp-ui-label-rate ${props.className || ''}`}/>
  );
}

export default RateText
