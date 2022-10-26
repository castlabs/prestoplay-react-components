import React, {useRef, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"

export interface BufferingIndicatorProps {
  player: Player
}

const BufferingIndicator = (props: BufferingIndicatorProps) => {
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
    <span>{buffering ? "Buffering": ""}</span>
  );
}

export default BufferingIndicator
