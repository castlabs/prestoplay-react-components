import React, {createRef, MouseEventHandler, useRef, useState} from "react";
import {Player, usePresto, usePrestoEvent} from "../Player";
import Slider from "./Slider";
import {BasePlayerComponentProps, p} from "../utils";
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

  usePresto(props.player, async (presto) => {
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

  const onKeyDown = async (e: KeyboardEvent) => {
    let presto = await props.player.presto()
    let current = presto.isMuted() ? 0 : presto.getVolume();
    let targetPosition = current
    if (e.key == "ArrowLeft") {
      targetPosition = Math.max(0, current + (-0.1));
      e.preventDefault()
    }else if(e.key == "ArrowRight") {
      targetPosition = Math.min(1, current + (0.1));
      e.preventDefault()
    }
    if(targetPosition != current) {
      presto.setVolume(targetPosition)
      if(presto.isMuted() && targetPosition > 0) {
        presto.setMuted(false)
      }
    }

  }


  return (
    <div className={`pp-ui-volumebar ${props.className || ''}`}>
      <Slider
        value={progress}
        onApplyValue={applyValue}
        currentValue={currentValue}
        onKeyDown={onKeyDown}
        adjustWhileDragging={props.adjustWhileDragging}
      />
    </div>
  )
}
export default VolumeBar
