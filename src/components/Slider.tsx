import React, {
  createRef,
  CSSProperties, useEffect,
  useRef,
  useState
} from "react";
import {BaseComponentProps} from "../utils";

/**
 * Properties that can be passed to the slider
 */
export interface SliderProps extends BaseComponentProps {
  /**
   * If true, mouse moves over the slider are tracked and reported
   * as the hover position. Use {@link SliderProps.onApplyHoverValue} to
   * receive the value
   */
  hoverMovement?: boolean
  /**
   * If true, {@link SliderProps.onApplyValue} is called while the thumb
   * is dragged
   */
  adjustWhileDragging?: boolean
  /**
   * The current value as a percentage value between 0 and 100
   */
  value: number
  /**
   * Callback function that received the new value that should be applied
   * @param value
   */
  onApplyValue?: (value: number) => void
  /**
   * Callback function that received the hover value if hovering or keyboard
   * interaction is enabled.
   *
   * @param value
   */
  onApplyHoverValue?: (value: number) => void
  /**
   * A callback that received a keyboard event. You can use this to implement
   * custom keyboard interactions. If this is set, the automatic keyboard
   * adjustment is disabled
   *
   * @param e
   */
  onKeyDown?: (e:KeyboardEvent) => void
  /**
   * Disable the automatic keyboard adjustment. By default, the slider tracks
   * arrow left and right keyboard events and starts interaction mode.
   */
  disableKeyboardAdjustments?: boolean
  /**
   * The current value
   */
  currentValue?: () => number
  /**
   * Disable the slider
   */
  disabled?: boolean
}

/**
 * A horizontal slider implementation.
 *
 * @param props
 * @constructor
 */
export const Slider = (props: SliderProps) => {
  let [interacting, setInteracting] = useState(false)
  let [adjustPosition, setAdjustPosition] = useState(false)
  let [progress, setProgress] = useState(props.value)
  let valueRef = useRef<number>()
  let progressRef = useRef<number>()
  valueRef.current = props.value
  progressRef.current = progress

  const containerRef = createRef<HTMLDivElement>();
  const barContainer = createRef<HTMLDivElement>();
  const currentProgress = (): number => interacting ? progress : valueRef.current!

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
    e.preventDefault()
  }

  async function mouseUp(e: React.MouseEvent | React.TouchEvent) {
    await drag(e)
    await setPositionFromMouseEvent(e);
    setAdjustPosition(false)
    if (!props.hoverMovement) {
      setInteracting(false)
    }
    e.preventDefault()
  }

  async function mouseMove(e: React.MouseEvent | React.TouchEvent) {
    if (props.hoverMovement || interacting) {
      setInteracting(true)
      await drag(e)
      if (adjustPosition && props.adjustWhileDragging) {
        await setPositionFromMouseEvent(e);
      }
      e.preventDefault()
    }
  }

  function mouseClick(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
  }

  async function mouseLeave(e: React.MouseEvent | React.TouchEvent) {
    if (adjustPosition) {
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
        return
      }
      if(props.disableKeyboardAdjustments) {
        return
      }

      // Check that the pressed key is one of the accepted keys
      const acceptedKeys = ["ArrowRight", "ArrowLeft", "Enter", "Space", "Escape"]
      if(acceptedKeys.indexOf(e.code) < 0) return

      // Make sure that we go into adjust mode with some keys
      if(!adjustPosition && (e.code == "ArrowRight" || e.code == "ArrowLeft")) {
        adjustPosition = true
        setAdjustPosition(true)
        setInteracting(true)
        progressRef.current = valueRef.current || 0
      }

      // if we are not in adjust mode by now, there is nothing to do
      if(!adjustPosition) return

      if(e.code == "Escape") {
        // Handle the case where we want to get out of adjust mode
        // without applying the value
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(-1)
        }
        setAdjustPosition(false)
        setInteracting(false)
        e.preventDefault()
      } else if(e.code == "Space" || e.code == "Enter") {
        // handle the case where we need to apply the value
        // and leave adjustment mode
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(-1)
        }

        if (props.onApplyValue) {
          props.onApplyValue(progressRef.current || 0)
        }
        setAdjustPosition(false)
        setInteracting(false)
        e.preventDefault()
      } else if(e.code == "ArrowLeft" || e.code == "ArrowRight") {
        let increment = 1
        let value = progressRef.current || 0
        value = Math.min(100, Math.max(0, value + (e.code == "ArrowLeft" ? -increment : +increment)))
        setProgress(Math.min(100, value))
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(value)
        }
        e.preventDefault()
      }
    }

    let focusOutListener = () => {
      // Handle the case where we want to get out of adjust mode
      // without applying the value
      if (props.onApplyHoverValue) {
        props.onApplyHoverValue(-1)
      }
      setAdjustPosition(false)
      setInteracting(false)
    }

    let target: HTMLDivElement;
    if (containerRef.current) {
      target = containerRef.current
      target.addEventListener("keydown", keyListener)
      target.addEventListener("focusout", focusOutListener)
    }
    return () => {
      if (target) {
        target.removeEventListener("keydown", keyListener)
        target.removeEventListener("focusout", focusOutListener)
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

  let progressStyle = {
    ...rangeStyles,
    right: 100 - currentProgress() + "%",
  }

  const nop = () => {}

  return (
    <div ref={containerRef}
         className={`pp-ui-slider ${interacting ? "pp-ui-slider-interacting" : ""} ${props.disabled ? 'pp-ui-disabled' : 'pp-ui-enabled'} ${props.className || ''}`}
         style={sliderStyles}
         onClick={props.disabled ? nop : mouseClick}
         onMouseMove={props.disabled ? nop : mouseMove}
         onMouseDown={props.disabled ? nop : mouseDown}
         onMouseUp={props.disabled ? nop : mouseUp}
         onMouseLeave={props.disabled ? nop : mouseLeave}
         onTouchMove={props.disabled ? nop : mouseMove}
         onTouchStart={props.disabled ? nop : mouseDown}
         onTouchEnd={props.disabled ? nop : mouseLeave}
         tabIndex={props.disabled ? -1 : 0 }
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
