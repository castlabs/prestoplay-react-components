import React, {
  createRef,
  CSSProperties, useEffect,
  useRef,
  useState
} from "react";
import {BaseComponentProps} from "../utils";

export interface SliderProps extends BaseComponentProps {
  hoverMovement?: boolean
  adjustWhileDragging?: boolean
  value: number
  onApplyValue?: (value: number) => void
  onApplyHoverValue?: (value: number) => void
  onKeyDown?: (e:KeyboardEvent) => void
  currentValue?: () => number
}

export const Slider = (props: SliderProps) => {
  let [interacting, setInteracting] = useState(false)
  let [adjustPosition, setAdjustPosition] = useState(false)
  let [progress, setProgress] = useState(props.value)
  let interactingRef = useRef<boolean>()
  let adjustPositionRef = useRef<boolean>()
  let valueRef = useRef<number>()
  let progressRef = useRef<number>()
  valueRef.current = props.value
  progressRef.current = progress
  interactingRef.current = interacting
  adjustPositionRef.current = adjustPosition

  const containerRef = createRef<HTMLDivElement>();
  const barContainer = createRef<HTMLDivElement>();
  const currentProgress = (): number => interactingRef.current ? progress : valueRef.current!

  function getPositionFromMouseEvent(e: React.MouseEvent | React.TouchEvent): number {
    let bg = barContainer.current
    if (!bg) {
      return -1
    }

    let rect = bg.getBoundingClientRect();
    let width = rect.width;
    let x: number
    if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
      let touchEvent = e as React.TouchEvent
      x = touchEvent.changedTouches[touchEvent.changedTouches.length - 1].pageX - rect.left;
    } else {
      x = (e as React.MouseEvent).pageX - rect.left;
    }
    return Math.min(100, Math.max(0, 100.0 * (x / width)));
  }

  async function setPositionFromMouseEvent(e: React.MouseEvent | React.TouchEvent) {
    let progress = getPositionFromMouseEvent(e);
    if (progress < 0) {
      return
    }
    if (props.onApplyValue) {
      props.onApplyValue(progress)
    }
  }

  async function drag(e: React.MouseEvent | React.TouchEvent) {
    let progress = getPositionFromMouseEvent(e);
    if (progress < 0) {
      return
    }
    setProgress(progress)
    if (props.onApplyHoverValue) {
      props.onApplyHoverValue(progress)
    }
  }

  async function mouseDown(e: React.MouseEvent | React.TouchEvent) {
    setInteracting(true)
    setAdjustPosition(true)
    await drag(e)
  }

  async function mouseUp(e: React.MouseEvent | React.TouchEvent) {
    await drag(e)
    await setPositionFromMouseEvent(e);
    setAdjustPosition(false)
    if (!props.hoverMovement) {
      setInteracting(false)
    }
  }

  async function mouseMove(e: React.MouseEvent | React.TouchEvent) {
    if (props.hoverMovement || interactingRef.current) {
      setInteracting(true)
      await drag(e)
      if (adjustPositionRef.current && props.adjustWhileDragging) {
        await setPositionFromMouseEvent(e);
      }
    }
  }

  async function mouseLeave(e: React.MouseEvent | React.TouchEvent) {
    if (adjustPositionRef.current) {
      setInteracting(false)
      await setPositionFromMouseEvent(e);
      setAdjustPosition(false)
    } else {
      setAdjustPosition(false)
      if (props.currentValue) {
        valueRef.current = await props.currentValue()
      }
      setInteracting(false)
    }
    if (props.onApplyHoverValue) {
      props.onApplyHoverValue(-1)
    }
  }


  useEffect(() => {
    let keyListener = (e: KeyboardEvent) => {
      if(props.onKeyDown) {
        props.onKeyDown(e)
      }
    }
    let target: HTMLDivElement;
    if (containerRef.current) {
      target = containerRef.current
      target.addEventListener("keydown", keyListener)
    }
    return () => {
      if (target) {
        target.removeEventListener("keydown", keyListener)
      }
    }
  })

  let sliderStyles: CSSProperties = {
    position: "relative",
    touchAction: "none"
  }

  let rangeStyles: CSSProperties = {
    position: "absolute",
    touchAction: "none",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto"
  }


  let markerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    // left: 0,
    margin: "auto",
    left: currentProgress() + "%"
  }

  // if(interactingRef.current) {
  //   markerStyle["transformOrigin"]= "center";
  //   markerStyle["transform"]= "translateX(-50%) scale(2)";
  // }

  let progressStyle = {
    ...rangeStyles,
    right: 100 - currentProgress() + "%",
  }

  return (
    <div ref={containerRef}
         className={`pp-ui-slider ${interacting ? "pp-ui-slider-interacting" : ""}${props.className || ''}`}
         style={sliderStyles}
         onMouseMove={mouseMove}
         onMouseDown={mouseDown}
         onMouseUp={mouseUp}
         onMouseLeave={mouseLeave}
         onTouchMove={mouseMove}
         onTouchStart={mouseDown}
         onTouchEnd={mouseLeave}
         tabIndex={0}
    >
      <div ref={barContainer}
           style={rangeStyles}
           className="pp-ui-slider-range ">
      </div>

      <div className="pp-ui-slider-range pp-ui-slider-range-progress"
           style={progressStyle}>
      </div>

      <div
        className={"pp-ui-slider-range-thumb"}
        style={markerStyle}>
      </div>

    </div>
  )
}

export default Slider
