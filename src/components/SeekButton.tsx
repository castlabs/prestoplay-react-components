import React from "react";
import {Player} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";

export interface SeekButtonProps extends BasePlayerComponentButtonProps {
  seconds: number
}

export const SeekButton = (props: SeekButtonProps) => {
  const seek = () => props.player.seek(props.player.position + props.seconds)

  if(!props.seconds) return <></>

  return (
    <BaseButton onClick={seek} disableIcon={props.disableIcon}
                className={`pp-ui-seek pp-ui-seek-${props.seconds < 0 ? "back" : "forward"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default SeekButton
