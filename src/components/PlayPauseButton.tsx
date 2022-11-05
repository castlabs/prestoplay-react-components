import React, {useRef, useState} from "react";
import {State} from "../Player";
import BaseButton from "./BaseButton";
import {BasePlayerComponentButtonProps} from "../utils";
import {usePrestoUiEvent} from "../react";

export interface PlayPauseButtonProps extends BasePlayerComponentButtonProps{
  resetRate?: boolean
}

export const PlayPauseButton = (props: PlayPauseButtonProps) => {
  let [isPlaying, setIsPlaying] = useState(false)
  let [rate, setRate] = useState(1);
  let rateRef = useRef<number>();
  rateRef.current = rate

  usePrestoUiEvent('ratechange', props.player, (rate) => {
    setRate(rate)
    if (rate != 1 && props.resetRate) {
      setIsPlaying(false)
    }
  })

  usePrestoUiEvent("statechanged", props.player, ({currentState}) => {
    switch (currentState) {
      case State.Idle:
        setIsPlaying(false)
        break;
      case State.Ended:
        setIsPlaying(false)
        break;
      case State.Paused:
        setIsPlaying(false)
        break;
      case State.Playing:
        if (!props.resetRate || rateRef.current == 1) {
          setIsPlaying(true)
        }
        break;
      case State.Error:
        setIsPlaying(false)
        break;
    }
  })

  async function toggle() {
    if (!props.resetRate || rateRef.current == 1) {
      props.player.playing = !props.player.playing
    } else {
      props.player.rate = 1
      props.player.playing = true
    }
  }

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon}
                className={`pp-ui-playpause-toggle pp-ui-playpause-toggle-${isPlaying ? "pause" : "play"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default PlayPauseButton
