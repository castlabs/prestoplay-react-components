import React, {useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentProps} from "../../utils";

export interface RateTextProps extends BasePlayerComponentProps{
}

const RateText = (props: RateTextProps) => {
  let [rate, setRate] = useState(1);

  usePrestoEvent('ratechange', props.player, (e, presto) => {
    let rate = presto.getPlaybackRate();
    if (rate != 0) {
      setRate(rate)
    }
  })

  return (
    <span className={`pp-ui pp-ui-label pp-ui-label-rate ${props.className || ''}`}>
      x{rate}
      {props.children}
    </span>
  );
}

export default RateText
