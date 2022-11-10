import React, {useState} from "react";
import Slider from "./Slider";
import {BasePlayerComponentProps, p} from "../utils";
import {usePresto, usePrestoUiEvent} from "../react";


export interface VolumeBarProps extends BasePlayerComponentProps{
  adjustWhileDragging?: boolean
}

export const VolumeBar = (props: VolumeBarProps) => {
  let [progress, setProgress] = useState(100)

  function updateFromPlayer(): number {
    const player = props.player;
    const progress = player.muted ? 0 : (player.volume * 100)
    setProgress(progress)
    return progress
  }

  usePrestoUiEvent("volumechange", props.player, () => {
    updateFromPlayer()
  })

  usePresto(props.player,  () => {
     updateFromPlayer()
  })

  usePrestoUiEvent("statechanged", props.player, () => {
    updateFromPlayer()
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
        onKeyDown={onKeyDown}
        adjustWhileDragging={props.adjustWhileDragging}
      />
    </div>
  )
}
export default VolumeBar
