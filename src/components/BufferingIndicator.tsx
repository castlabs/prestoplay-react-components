import React, {useRef, useState} from "react";
import {Player, usePrestoEvent} from "../Player";
import {BasePlayerComponentProps} from "../utils";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"

export interface BufferingIndicatorProps extends BasePlayerComponentProps{
  player: Player
}

export const BufferingIndicator = (props: BufferingIndicatorProps) => {
  let [buffering, setBuffering] = useState(false);
  let bufferingRef = useRef<boolean>()
  bufferingRef.current = buffering

  usePrestoEvent(clpp.events.STATE_CHANGED, props.player, (e, presto) => {
    switch (e.detail.currentState) {
      case clpp.Player.State.IDLE:
      case clpp.Player.State.ERROR:
      case clpp.Player.State.PLAYING:
      case clpp.Player.State.PAUSED:
      case clpp.Player.State.ENDED:
        setBuffering(false)
        break;
      case clpp.Player.State.BUFFERING:
      case clpp.Player.State.PREPARING:
        setBuffering(true)
    }
  })

  return (
    <div className={`pp-ui pp-ui-spinner ${bufferingRef.current ? 'pp-ui-spinner-loading': ''} ${props.className || ''}`} style={props.style}>
      <i className={`pp-ui pp-ui-icon`}/>
      {props.children || ''}
    </div>
  );
}

export default BufferingIndicator
