import React, {useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentButtonProps} from "../../utils";
import BaseButton from "../BaseButton";

export interface MuteButtonProps extends BasePlayerComponentButtonProps{
}

const MuteButton = (props: MuteButtonProps) => {
  let [muted, setMuted] = useState(false);

  usePrestoEvent('volumechange', props.player, (e, presto) => {
    setMuted(presto.isMuted())
  })
  usePrestoEvent('loadedmetadata', props.player, (e, presto) => {
    setMuted(presto.isMuted())
  })

  async function toggle() {
    const presto = await props.player.presto()
    presto.setMuted(!presto.isMuted())
  }

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon}
                className={`pp-ui-mute-toggle pp-ui-mute-toggle-${muted? "unmuted" : "muted"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default MuteButton
