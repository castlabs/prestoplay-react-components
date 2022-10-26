import React, {createRef, MouseEventHandler, useRef, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
import Slider from "../Slider";
import {BasePlayerComponentProps} from "../../utils";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"


export interface VolumeBarProps extends BasePlayerComponentProps{
  adjustWhileDragging?: boolean
}

const VolumeBar = (props: VolumeBarProps) => {
  let [progress, setProgress] = useState(100)

  async function updateFromPlayer(presto?:any): Promise<number> {
    presto = presto || await props.player.presto()
    let volume = presto.getVolume();
    let progress = volume * 100
    if (presto.isMuted()) {
      progress = 0
    }
    setProgress(progress)
    return progress
  }

  usePrestoEvent("volumechange", props.player, async (_, presto) => {
    await updateFromPlayer(presto)
  })

  usePrestoEvent("initialized", props.player, async (_, presto) => {
    await updateFromPlayer(presto)
  })

  usePrestoEvent(clpp.events.STATE_CHANGED, props.player, async (_, presto) => {
    await updateFromPlayer(presto)
  })

  async function applyValue(progressValue:number) {
    let presto = await props.player.presto()
    if (presto.isMuted() && progressValue > 0) {
      presto.setMuted(false)
    }
    presto.setVolume(progressValue / 100.0)
  }

  function currentValue() {
    return updateFromPlayer()
  }

  return (
    <Slider
      className={`pp-ui-volumebar ${props.className || ''}`}
      value={progress}
      onApplyValue={applyValue}
      currentValue={currentValue}
      adjustWhileDragging={props.adjustWhileDragging}
    />
  )
}
export default VolumeBar
