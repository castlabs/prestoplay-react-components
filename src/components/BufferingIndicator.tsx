import React, {useState} from "react";
import {Player, State, usePrestoUiEvent} from "../Player";
import {BasePlayerComponentProps} from "../utils";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"

export interface BufferingIndicatorProps extends BasePlayerComponentProps{
  player: Player
}

const isBufferingState = (state: State): boolean => {
  return state == State.Preparing || state == State.Buffering
}
export const BufferingIndicator = (props: BufferingIndicatorProps) => {
  let [buffering, setBuffering] = useState(isBufferingState(props.player.state));

  usePrestoUiEvent("statechanged", props.player, (data) => {
    setBuffering(isBufferingState(data.currentState))
  })

  return (
    <div className={`pp-ui pp-ui-spinner ${buffering ? 'pp-ui-spinner-loading': ''} ${props.className || ''}`} style={props.style}>
      <i className={`pp-ui pp-ui-icon`}/>
      {props.children || ''}
    </div>
  );
}

export default BufferingIndicator
