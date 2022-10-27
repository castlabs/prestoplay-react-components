import React, {useState} from "react";
import {Player, usePrestoEvent} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";

export interface RateButtonProps extends BasePlayerComponentButtonProps{
  factor?: number
  max?: number
  min?: number
}

const RateButton = (props: RateButtonProps) => {
  let [rate, setRate] = useState(1);

  usePrestoEvent('ratechange', props.player, (e, presto) => {
    let rate = presto.getPlaybackRate();
    if (rate != 0) {
      setRate(rate)
    }
  })

  async function adjustRate() {
    const presto = await props.player.presto()
    let rate = presto.getPlaybackRate()
    let newRate = Math.min(props.max || 64, Math.max(props.min || 0.5, rate * (props.factor || 2)))
    presto.setPlaybackRate(newRate)
  }

  return (
    <BaseButton onClick={adjustRate} disableIcon={props.disableIcon}
                className={`pp-ui-rate pp-ui-rate-${(props.factor || 2) < 1 ? "fr" : "ff"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default RateButton
