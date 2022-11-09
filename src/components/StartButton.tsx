import React, {createRef, useEffect, useRef, useState} from "react";
import {BasePlayerComponentButtonProps, focusElement} from "../utils";
import BaseButton from "./BaseButton";
import {State} from "../Player";
import {usePrestoUiEvent} from "../react";

export interface StartButtonProps extends BasePlayerComponentButtonProps {
}

export const StartButton = (props: StartButtonProps) => {
  let [visible, setVisible] = useState(props.player.state == State.Idle || props.player.state == State.Unset);
  let ref = createRef<HTMLButtonElement>();

  usePrestoUiEvent("statechanged", props.player, ({currentState}) => {
    setVisible(props.player.state == State.Idle || props.player.state == State.Unset)
  })

  useEffect(() =>{
    if(ref.current && visible) {
      focusElement(ref.current)
    }
  }, [ref])

  const start = async () => {
    await props.player.load()
    props.player.playing = true
    setVisible(false)
    props.player.surfaceInteraction()
  }

  return (
    <BaseButton onClick={start} ref={ref}
                disableIcon={false}
                style={props.style}
                className={`pp-ui pp-ui-start-button ${visible ? '' : 'pp-ui-start-button-hidden'} ${props.className}`}/>
  )
}

export default StartButton
