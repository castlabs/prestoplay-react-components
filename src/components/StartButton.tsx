import React, {useEffect, useState} from "react";
import {Player, usePrestoEvent} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {
  BasePlayerComponentButtonProps,
} from "../utils";
import BaseButton from "./BaseButton";

export interface StartButtonProps extends BasePlayerComponentButtonProps{
  config: any
}

export const StartButton = (props: StartButtonProps) => {
  let [visible, setVisible] = useState(!!props.config);

  const start = async () => {
    let presto = await props.player.presto();
    if (props.config) {
      let cfg = props.config
      cfg.autoplay = true
      presto.load(cfg)
    } else {
      presto.play()
    }
    setVisible(false)
  }

  useEffect(() => {
    if (!props.config) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }, [props.config])

  return (
    <BaseButton onClick={start}
                disableIcon={false}
                style={props.style}
                className={`pp-ui pp-ui-start-button ${visible ? '': 'pp-ui-start-button-hidden'} ${props.className}`}/>
  )
}

export default StartButton
