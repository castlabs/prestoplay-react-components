import React, {useState} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {State} from "../Player";
import {usePrestoUiEvent} from "../react";

export interface StartButtonProps extends BasePlayerComponentButtonProps {
}

export const StartButton = (props: StartButtonProps) => {
  let [visible, setVisible] = useState(props.player.state == State.Idle || props.player.state == State.Unset);

  usePrestoUiEvent("statechanged", props.player, ({currentState}) => {
    setVisible(props.player.state == State.Idle || props.player.state == State.Unset)
  })

  const start = async () => {
    await props.player.load()
    props.player.playing = true
    setVisible(false)
  }

  return (
    <BaseButton onClick={start}
                disableIcon={false}
                style={props.style}
                className={`pp-ui pp-ui-start-button ${visible ? '' : 'pp-ui-start-button-hidden'} ${props.className}`}/>
  )
}

export default StartButton
