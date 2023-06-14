import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { setRef } from '../utils/react'

import type { BaseComponentProps } from './types'

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
  onApplyValue?: (value: number) => unknown
  /**
   * Callback function that received the hover value if hovering or keyboard
   * interaction is enabled.
   *
   * @param value
   */
  onApplyHoverValue?: (value: number) => unknown
  /**
   * A callback that received a keyboard event. You can use this to implement
   * custom keyboard interactions. If this is set, the automatic keyboard
   * adjustment is disabled
   *
   * @param e
   */
  onKeyDown?: (e: KeyboardEvent) => unknown
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

const noop = () => {}

type PressEvent = React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>

const getPositionFromMouseEvent = (e: PressEvent, container: HTMLDivElement | null) => {
  if (!container) {
    return -1
  }

  const rect = container.getBoundingClientRect()
  const width = rect.width
  let x: number
  if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
    // Eslint false alarm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const touchEvent = e as React.TouchEvent<HTMLDivElement>
    x = touchEvent.changedTouches[touchEvent.changedTouches.length - 1].pageX - rect.left
  } else {
    x = (e as React.MouseEvent).pageX - rect.left
  }

  return Math.min(100, Math.max(0, 100.0 * (x / width)))
}

/**
 * A horizontal slider.
 */
export const Slider = forwardRef((props: SliderProps, ref) => {
  const [interacting, setInteracting] = useState(false)
  const [adjustPosition, setAdjustPosition] = useState(false)
  const [progress, setProgress] = useState(props.value)
  const containerRef = useRef<HTMLDivElement|null>(null)
  const barContainer = useRef<HTMLDivElement|null>(null)
  const currentProgress = (): number => interacting ? progress : props.value

  function setPositionFromMouseEvent(e: PressEvent) {
    const progress = getPositionFromMouseEvent(e, barContainer.current)
    if (progress < 0) {
      return
    }
    if (props.onApplyValue) {
      props.onApplyValue(progress)
    }
  }

  const setProgressAndHoverValueFromMouseEvent = (e: PressEvent, maybeApplyHover=true) => {
    const progress = getPositionFromMouseEvent(e, barContainer.current)
    if (progress < 0) {
      return
    }
    setProgress(progress)

    if (maybeApplyHover && props.onApplyHoverValue) {
      props.onApplyHoverValue(progress)
    }
  }

  function mouseDown(e: PressEvent) {
    setInteracting(true)
    setAdjustPosition(true)
    setProgressAndHoverValueFromMouseEvent(e, false)
  }

  function mouseUp(e: PressEvent) {
    if (e.type.startsWith('touch')) {
      // We need to prevent the default here in case of a touch event to make
      // sure that mouse events are not triggered, and we operate exclusively
      // on touch
      e.preventDefault()
    }

    setProgressAndHoverValueFromMouseEvent(e, false)
    setPositionFromMouseEvent(e)
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

  function mouseMove(e: PressEvent) {
    // If we are tracking hover movement or iwe are interacting
    // we need to update the hover position and maybe also the
    // actual position
    if (props.hoverMovement || interacting) {
      setInteracting(true)
      setProgressAndHoverValueFromMouseEvent(e)
      if (adjustPosition && props.adjustWhileDragging) {
        setPositionFromMouseEvent(e)
      }
    }
  }

  function mouseClick(e: PressEvent) {
    e.preventDefault()
  }

  function mouseLeave(e: PressEvent) {
    // we left the tracking area, so we are no longer interacting
    setInteracting(false)

    // if we were adjusting the position, we need to apply that now
    if (adjustPosition) {setPositionFromMouseEvent(e)}
    setAdjustPosition(false)

    // Reset any hover values
    if (props.onApplyHoverValue) {
      props.onApplyHoverValue(-1)
    }
  }

  // TODO this happens on every re-render, so keydown and focusout
  // listeners are being attached/removed on every rerender.
  // This is typically not a good idea. We check if this does not
  // affect performance negatively.
  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (props.onKeyDown) {
        props.onKeyDown(e)
        return
      }
      if (props.disableKeyboardAdjustments) {
        return
      }

      // Check that the pressed key is one of the accepted keys
      const acceptedKeys = ['ArrowRight', 'ArrowLeft', 'Enter', 'Space', 'Escape']
      if (acceptedKeys.indexOf(e.code) < 0) {return}

      // Make sure that we go into adjust mode with some keys
      if (!adjustPosition && (e.code === 'ArrowRight' || e.code === 'ArrowLeft')) {
        setAdjustPosition(true)
        setInteracting(true)
        setProgress(progress)
      }

      // if we are not in adjust mode by now, there is nothing to do
      if (!adjustPosition) {return}

      if (e.code === 'Escape') {
        // Handle the case where we want to get out of adjust mode
        // without applying the value
        if (props.onApplyHoverValue) {
          props.onApplyHoverValue(-1)
        }
        setAdjustPosition(false)
        setInteracting(false)
        e.preventDefault()
      } else if (e.code === 'Space' || e.code === 'Enter') {
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
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        const increment = 1
        let value = progress
        value = Math.min(100, Math.max(0, value + (e.code === 'ArrowLeft' ? -increment : +increment)))
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
  }) // TODO fix this

  const sliderStyles = useMemo((): CSSProperties => {
    return {
      ...props.style,
      position: 'relative',
      touchAction: 'none',
    }
  }, [props.style])

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

  const handleContainerRef = useCallback((ref_: HTMLDivElement | null) => {
    containerRef.current= ref_
    setRef(ref, ref_)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={handleContainerRef}
      data-testid="pp-ui-slider"
      className={`pp-ui-slider ${interacting ? 'pp-ui-slider-interacting' : ''} `
        + `${props.disabled ? 'pp-ui-disabled' : 'pp-ui-enabled'} ${props.className || ''}`}
      style={sliderStyles}
      onClick={props.disabled ? noop : mouseClick}

      onMouseDown={props.disabled ? noop : mouseDown}
      onMouseMove={props.disabled ? noop : mouseMove}
      onMouseUp={props.disabled ? noop : mouseUp}

      onMouseLeave={props.disabled ? noop : mouseLeave}

      onTouchStart={props.disabled ? noop : mouseDown}
      onTouchMove={props.disabled ? noop : mouseMove}
      onTouchEnd={props.disabled ? noop : mouseUp}

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
})

Slider.displayName = 'Slider'
