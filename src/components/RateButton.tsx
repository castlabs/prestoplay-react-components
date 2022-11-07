import React from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {usePrestoEnabledState} from "../react";

export interface RateButtonProps extends BasePlayerComponentButtonProps{
  factor?: number
  max?: number
  min?: number
}

export const RateButton = (props: RateButtonProps) => {
  let enabled = usePrestoEnabledState(props.player);
  async function adjustRate() {
    let rate = props.player.rate
    props.player.rate = Math.min(props.max || 64, Math.max(props.min || 0.5, rate * (props.factor || 2)))
  }

  return (
    <BaseButton onClick={adjustRate} disableIcon={props.disableIcon} disabled={!enabled}
                className={`pp-ui-rate pp-ui-rate-${(props.factor || 2) < 1 ? "fr" : "ff"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default RateButton
