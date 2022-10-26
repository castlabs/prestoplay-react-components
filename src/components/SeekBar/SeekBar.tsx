import React, {createRef, MouseEventHandler, useRef, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
import Slider from "../Slider";
import {BasePlayerComponentProps} from "../../utils";

export interface SeekBarProps extends BasePlayerComponentProps{
  adjustWhileDragging?: boolean
}

const SeekBar = (props: SeekBarProps) => {
  let [progress, setProgress] = useState(0)

  async function updateFromPlayer(presto?:any): Promise<number> {
    presto = presto || await props.player.presto()
    let range = presto.getSeekRange();
    let currentTime = presto.getPosition();
    let rangeDuration = range.end - range.start;
    let positionInRange = currentTime - range.start;
    const progress = Math.min(100, Math.max(0, 100.0 * (positionInRange / rangeDuration)));
    setProgress(progress)
    return progress
  }

  usePrestoEvent("timeupdate", props.player, async (_, presto) => {
    await updateFromPlayer(presto)
  })

  async function applyValue(progressValue:number) {
    let presto = await props.player.presto()
    let seekRange = presto.getSeekRange();
    let range = seekRange.end - seekRange.start;
    let targetPosition = seekRange.start + (range * (progressValue / 100.0));
    presto.seek(targetPosition)
  }

  async function applyHoverValue(hoverValue:number) {
    if(hoverValue <= 0) {
      props.player.setHoverPosition(hoverValue);
      return
    }
    let presto = await props.player.presto()
    let seekRange = presto.getSeekRange()
    let range = seekRange.end - seekRange.start;
    let hoverPosition = seekRange.start + (range * (hoverValue / 100.0));
    props.player.setHoverPosition(hoverPosition)
  }

  function currentValue() {
    return updateFromPlayer()
  }

  return (
    <Slider
      className={`pp-ui-seekbar ${props.className || ''}`}
      hoverMovement={true}
      value={progress}
      onApplyValue={applyValue}
      onApplyHoverValue={applyHoverValue}
      currentValue={currentValue}
      adjustWhileDragging={props.adjustWhileDragging}
    />
  )
}
export default SeekBar
