import React, {useState} from "react";
import {usePrestoUiEvent} from "../Player";
import Slider from "./Slider";
import {BasePlayerComponentProps, p} from "../utils";
import Thumbnail from "./Thumbnail";

export interface SeekBarProps extends BasePlayerComponentProps {
  adjustWhileDragging?: boolean
  enableThumbnailSlider?: boolean
  keyboardSeekForward?: number
  keyboardSeekBackward?: number
}

export const SeekBar = (props: SeekBarProps) => {
  let [progress, setProgress] = useState(0)
  let [hoverPosition, setHoverPosition] = useState(-1)
  let [hoverValue, setHoverValue] = useState(0)
  let [thumbWidth, setThumbWidth] = useState(0)


  function updateFromPlayer(position?: number): number {
    const player = props.player
    const range = player.seekRange
    const rangeDuration = range.end - range.start;
    position = position || props.player.position
    const positionInRange = position! - range.start;
    const progress = Math.min(100, Math.max(0, 100.0 * (positionInRange / rangeDuration)));
    setProgress(progress)
    return progress
  }

  usePrestoUiEvent("position", props.player, async (position) => {
    updateFromPlayer(position)
  })

  async function applyValue(progressValue: number) {
    let seekRange = props.player.seekRange
    let range = seekRange.end - seekRange.start;
    let targetPosition = seekRange.start + (range * (progressValue / 100.0));
    props.player.seek(targetPosition)
  }

  async function applyHoverValue(hoverValue: number) {
    if (hoverValue <= 0) {
      props.player.setHoverPosition(hoverValue, hoverValue);
      setHoverPosition(hoverValue)
      setHoverValue(0)
      return
    }

    let seekRange = props.player.seekRange
    let range = seekRange.end - seekRange.start;
    let hoverPosition = seekRange.start + (range * (hoverValue / 100.0));
    props.player.setHoverPosition(hoverPosition, hoverValue)
    setHoverValue(hoverValue)
    setHoverPosition(hoverPosition)
  }

  const onThumbSize = (width:number, height:number) => {
    setThumbWidth(width)
  }

  const renderThumbnailSlider = () => {
    if(!props.enableThumbnailSlider) return;
    return (
      <Thumbnail player={props.player} position={hoverPosition}
                 onThumbSize={onThumbSize}
                 style={{
                   position: "absolute",
                   margin: "auto",
                   left: `min(max(${thumbWidth / 2}px, ${hoverValue}%), calc(100% - ${thumbWidth / 2}px))`
                 }}/>
    )
  }

  const onKeyDown = async (e: KeyboardEvent) => {
    let player = props.player
    let range = player.seekRange
    let targetPosition = -1
    let seekForward = p(props.keyboardSeekForward, 10)
    let seekBackward = p(props.keyboardSeekBackward, -10)
    let currentTime = player.position;
    if (e.key == "ArrowLeft" && seekBackward != 0) {
      targetPosition = Math.max(range.start, currentTime + seekBackward);
    }else if(e.key == "ArrowRight" && seekForward != 0) {
      targetPosition = Math.min(currentTime + seekForward, range.end);
    }
    if(targetPosition >= 0) {
      player.seek(targetPosition)
      let rangeDuration = range.end - range.start;
      let positionInRange = targetPosition - range.start;
      const progress = Math.min(100, Math.max(0, 100.0 * (positionInRange / rangeDuration)));
      setProgress(progress)
    }

  }

  return (
    <div className={`pp-ui-seekbar ${props.className || ''}`}>
      <Slider
        hoverMovement={true}
        value={progress}
        onKeyDown={onKeyDown}
        onApplyValue={applyValue}
        onApplyHoverValue={applyHoverValue}
        currentValue={updateFromPlayer}
        adjustWhileDragging={props.adjustWhileDragging}
      >
      </Slider>
      {renderThumbnailSlider()}
    </div>
  )
}
export default SeekBar
