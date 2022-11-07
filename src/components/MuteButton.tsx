import React, {useState} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {usePrestoCoreEvent, usePrestoEnabledState} from "../react";

export interface MuteButtonProps extends BasePlayerComponentButtonProps{
}

export const MuteButton = (props: MuteButtonProps) => {
  let [muted, setMuted] = useState(false);
  let enabled = usePrestoEnabledState(props.player);

  usePrestoCoreEvent('volumechange', props.player, (e, presto) => {
    setMuted(presto.isMuted())
  })
  usePrestoCoreEvent('loadedmetadata', props.player, (e, presto) => {
    setMuted(presto.isMuted())
  })

  async function toggle() {
    const presto = await props.player.presto()
    presto.setMuted(!presto.isMuted())
  }

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon} disabled={!enabled}
                className={`pp-ui-mute-toggle pp-ui-mute-toggle-${muted? "unmuted" : "muted"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default MuteButton
