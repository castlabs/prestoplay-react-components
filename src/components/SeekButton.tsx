import React from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {usePrestoEnabledState} from "../react";

export interface SeekButtonProps extends BasePlayerComponentButtonProps {
  seconds: number
}

export const SeekButton = (props: SeekButtonProps) => {
  const seek = () => props.player.position += props.seconds
  let enabled = usePrestoEnabledState(props.player);

  if(!props.seconds) return <></>

  return (
    <BaseButton onClick={seek} disableIcon={props.disableIcon} disabled={!enabled}
                className={`pp-ui-seek pp-ui-seek-${props.seconds < 0 ? "back" : "forward"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default SeekButton
