import React, {useState} from "react";
import {BufferingReason, State} from "../Player";
import BaseButton from "./BaseButton";
import {BasePlayerComponentButtonProps} from "../utils";
import {usePrestoUiEvent} from "../react";

/**
 * Props for the play/pause toggle button
 */
export interface PlayPauseButtonProps extends BasePlayerComponentButtonProps {
  /**
   * If set to true, the button will change to the non-playing state if the
   * playback rate is not 1 and will, when clicked, change the playback rate
   * back to 1.
   */
  resetRate?: boolean
}

function isPlayingState(state: State, props: PlayPauseButtonProps, bufferingReason?: BufferingReason): boolean {
  if (state != State.Playing) {
    if(state == State.Buffering && bufferingReason == BufferingReason.Seeking) {
      return props.player.playing
    }
    return false
  }
  return !(props.resetRate && props.player.rate !== 1);
}

/**
 * The play pause toggle button.
 *
 * @param props
 * @constructor
 */
export const PlayPauseButton = (props: PlayPauseButtonProps) => {
  let [isPlaying, setIsPlaying] = useState(isPlayingState(props.player.state, props))

  usePrestoUiEvent('ratechange', props.player, () => {
    setIsPlaying(isPlayingState(props.player.state, props))
  })

  usePrestoUiEvent("statechanged", props.player, ({currentState, reason}) => {
    setIsPlaying(isPlayingState(currentState, props, reason))
  })

  async function toggle() {
    let player = props.player;
    if (!props.resetRate || player.rate == 1) {
      player.playing = !player.playing
    } else {
      player.rate = 1
      player.playing = true
    }
  }

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon} style={props.style}
                className={`pp-ui-playpause-toggle pp-ui-playpause-toggle-${isPlaying ? "pause" : "play"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default PlayPauseButton
