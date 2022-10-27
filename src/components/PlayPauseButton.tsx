import React, {useEffect, useRef, useState} from "react";
import {Player, usePrestoEvent} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import BaseButton from "./BaseButton";
import {BasePlayerComponentButtonProps} from "../utils";

export interface PlayPauseButtonProps extends BasePlayerComponentButtonProps{
  resetRate?: boolean
}

const PlayPauseButton = (props: PlayPauseButtonProps) => {
  let [isPlaying, setIsPlaying] = useState(false)
  let [rate, setRate] = useState(1);
  let rateRef = useRef<number>();
  rateRef.current = rate

  usePrestoEvent('ratechange', props.player, (e, presto) => {
    let rate = presto.getPlaybackRate();
    if (rate != 0) {
      setRate(rate)
      if (rate != 1 && props.resetRate) {
        setIsPlaying(false)
      }
    }
  })

  usePrestoEvent(clpp.events.STATE_CHANGED, props.player, (e, _) => {
    switch (e.detail.currentState) {
      case clpp.Player.State.IDLE:
        setIsPlaying(false)
        break;
      case clpp.Player.State.ENDED:
        setIsPlaying(false)
        break;
      case clpp.Player.State.PAUSED:
        setIsPlaying(false)
        break;
      case clpp.Player.State.PLAYING:
        if (!props.resetRate || rateRef.current == 1) {
          setIsPlaying(true)
        }
        break;
      case clpp.Player.State.ERROR:
        setIsPlaying(false)
        break;
    }
  })

  async function toggle() {
    const presto = await props.player.presto()
    if (!props.resetRate || rateRef.current == 1) {
      presto.isPaused() ? presto.play() : presto.pause()
    } else {
      presto.setPlaybackRate(1)
      presto.play()
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
