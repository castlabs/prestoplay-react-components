import React, {
  createRef,
  CSSProperties, useEffect,
  useState,
} from 'react'

import { BaseComponentProps } from '../utils'

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
   * Disable the slider
   */
  disabled?: boolean
  /**
   * Sliders are also focusable by default.
   */
  notFocusable?: boolean
}

/**
 * A horizontal slider implementation.
 *
 * @param props
 * @constructor
 */
export const Slider = (props: SliderProps) => {
  const [interacting, setInteracting] = useState(false)
  let [adjustPosition, setAdjustPosition] = useState(false)
  let [progress, setProgress] = useState(props.value)

  const containerRef = createRef<HTMLDivElement>()
  const barContainer = createRef<HTMLDivElement>()
  const currentProgress = (): number => interacting ? progress : props.value

  function getPositionFromMouseEvent(e: React.MouseEvent | React.TouchEvent): number {
    const bg = barContainer.current
    if (!bg) {
      return -1
    }

    const rect = bg.getBoundingClientRect()
    const width = rect.width
    let x: number
    if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
      const touchEvent = e as React.TouchEvent
      x = touchEvent.changedTouches[touchEvent.changedTouches.length - 1].pageX - rect.left
    } else {
      x = (e as React.MouseEvent).pageX - rect.left
    }
    return Math.min(100, Math.max(0, 100.0 * (x / width)))
  }

  async function setPositionFromMouseEvent(e: React.MouseEvent | React.TouchEvent) {
    const progress = getPositionFromMouseEvent(e)
    if (progress < 0) {
      return
    }
    if (props.onApplyValue) {
      props.onApplyValue(progress)
    }
  }

  async function setProgressAndHoverValueFromMouseEvent(e: React.MouseEvent | React.TouchEvent, maybeApplyHover=true) {
    const progress = getPositionFromMouseEvent(e)
    if (progress < 0) {
      return
    }
    setProgress(progress)

    if (maybeApplyHover && props.onApplyHoverValue) {
      props.onApplyHoverValue(progress)
    }
  }

  async function mouseDown(e: React.MouseEvent | React.TouchEvent) {
    setInteracting(true)
    setAdjustPosition(true)
    await setProgressAndHoverValueFromMouseEvent(e, false)
  }

  async function mouseUp(e: React.MouseEvent | React.TouchEvent) {
    if (e.type.startsWith('touch')) {
      // We need to prevent the default here in case of a touch event to make
      // sure that mouse events are not triggered, and we operate exclusively
      // on touch
      e.preventDefault()
    }

    await setProgressAndHoverValueFromMouseEvent(e, false)
    await setPositionFromMouseEvent(e)
    setAdjustPosition(false)

    // We stop interaction only of we were not tracking the hover position,
    // since this means no thumb was ever shown or if the event was a touch
    // event. In that case we are also not "hovering" so any thumb and hover
    // tracking should be stopped and we stop interaction
    if (!props.hoverMovement || e.type.startsWith('touch')) {
      setInteracting(false)
      if (props.onApplyHoverValue) {
        props.onApplyHoverValue(-1)
      }
    }
  }

  async function mouseMove(e: React.MouseEvent | React.TouchEvent) {
    // If we are tracking hover movement or iwe are interacting
    // we need to update the hover position and maybe also the
    // actual position
    if (props.hoverMovement || interacting) {
      setInteracting(true)
      await setProgressAndHoverValueFromMouseEvent(e)
      if (adjustPosition && props.adjustWhileDragging) {
        await setPositionFromMouseEvent(e)
      }
    }
  }

  function mouseClick(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
  }

  async function mouseLeave(e: React.MouseEvent | React.TouchEvent) {
    // we left the tracking area, so we are no longer interacting
    setInteracting(false)

    // if we were adjusting the position, we need to apply that now
    if (adjustPosition) {await setPositionFromMouseEvent(e)}
    setAdjustPosition(false)

    // Reset any hover values
    if (props.onApplyHoverValue) {
      props.onApplyHoverValue(-1)
    }
  }

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if(props.onKeyDown) {
        props.onKeyDown(e)
        return
      }
      if(props.disableKeyboardAdjustments) {
        return
      }

      // Check that the pressed key is one of the accepted keys
      const acceptedKeys = ['ArrowRight', 'ArrowLeft', 'Enter', 'Space', 'Escape']
      if(acceptedKeys.indexOf(e.code) < 0) {return}

      // Make sure that we go into adjust mode with some keys
      if(!adjustPosition && (e.code == 'ArrowRight' || e.code == 'ArrowLeft')) {
        adjustPosition = true
        setAdjustPosition(true)
        setInteracting(true)
        progress = props.value
        setProgress(progress)
      }

      // if we are not in adjust mode by now, there is nothing to do
      if(!adjustPosition) {return}

      if(e.code == 'Escape') {
        // Handle the case where we want to get out of adjust mode
        // without applying the value
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(-1)
        }
        setAdjustPosition(false)
        setInteracting(false)
        e.preventDefault()
      } else if(e.code == 'Space' || e.code == 'Enter') {
        // handle the case where we need to apply the value
        // and leave adjustment mode
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(-1)
        }

        if (props.onApplyValue) {
          props.onApplyValue(progress)
        }
        setAdjustPosition(false)
        setInteracting(false)
        e.preventDefault()
      } else if(e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
        const increment = 1
        let value = progress
        value = Math.min(100, Math.max(0, value + (e.code == 'ArrowLeft' ? -increment : +increment)))
        setProgress(Math.min(100, value))
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(value)
        }
        e.preventDefault()
      }
    }

    const focusOutListener = () => {
      // Handle the case where we want to get out of adjust mode
      // without applying the value
      if (props.onApplyHoverValue) {
        props.onApplyHoverValue(-1)
      }
      setAdjustPosition(false)
      setInteracting(false)
    }

    let target: HTMLDivElement
    if (containerRef.current) {
      target = containerRef.current
      target.addEventListener('keydown', keyListener)
      target.addEventListener('focusout', focusOutListener)
    }
    return () => {
      if (target) {
        target.removeEventListener('keydown', keyListener)
        target.removeEventListener('focusout', focusOutListener)
      }
    }
  })

  const sliderStyles: CSSProperties = {
    position: 'relative',
    touchAction: 'none',
  }

  const rangeStyles: CSSProperties = {
    position: 'absolute',
    touchAction: 'none',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
  }


  const markerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    // left: 0,
    margin: 'auto',
    left: `${currentProgress()}%`,
  }

  const progressStyle = {
    ...rangeStyles,
    right: `${100 - currentProgress()}%`,
  }

  const nop = () => {}

  return (
    <div ref={containerRef}
      className={`pp-ui-slider ${interacting ? 'pp-ui-slider-interacting' : ''} `
        + `${props.disabled ? 'pp-ui-disabled' : 'pp-ui-enabled'} ${props.className || ''}`}
      style={sliderStyles}
      onClick={props.disabled ? nop : mouseClick}

      onMouseDown={props.disabled ? nop : mouseDown}
      onMouseMove={props.disabled ? nop : mouseMove}
      onMouseUp={props.disabled ? nop : mouseUp}

      onMouseLeave={props.disabled ? nop : mouseLeave}

      onTouchStart={props.disabled ? nop : mouseDown}
      onTouchMove={props.disabled ? nop : mouseMove}
      onTouchEnd={props.disabled ? nop : mouseUp}

      tabIndex={props.disabled ? -1 : (props.notFocusable ? -1 : 0) }
    >
      <div ref={barContainer}
        style={rangeStyles}
        className="pp-ui-slider-range ">
      </div>

      <div className="pp-ui-slider-range pp-ui-slider-range-progress"
        style={progressStyle}>
      </div>

      <div
        className={'pp-ui-slider-range-thumb'}
        style={markerStyle}>
      </div>

    </div>
  )
}

export default Slider
