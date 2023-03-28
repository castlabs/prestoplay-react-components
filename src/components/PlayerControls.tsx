import React, {
  useEffect,
  useRef,
  useState,
} from 'react'

import { usePrestoUiEvent } from '../react'
import {
  BasePlayerComponentProps, focusElement,
  focusNextElement,
  getFocusableElements, isIpadOS,
} from '../utils'

const DEFAULT_HIDE_DELAY = 5

export interface PlayerControlsProps extends BasePlayerComponentProps {
  hideDelay?: number
  showWhenDisabled?: boolean
}

export const PlayerControls = (props: PlayerControlsProps) => {
  const [controlsVisible, setControlsVisible_] = useState(
    props.player.controlsVisible || (props.showWhenDisabled && !props.player.enabled))
  const [lastFocusIndex, setLastFocusIndex] = useState(-1)

  const timer = useRef<ReturnType<typeof setTimeout>|null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const setControlsVisible = (visible: boolean, fromUiEvent = false) => {
    if (!fromUiEvent) {
      props.player.controlsVisible = visible
    }
    setControlsVisible_(visible)
  }

  usePrestoUiEvent('controlsVisible', props.player, (visible) => {
    setControlsVisible(visible, true)
    if (visible) {
      createTimer()
    }
  })

  usePrestoUiEvent('slideInMenuVisible', props.player, (visible) => {
    setControlsVisible(!visible)
    if (!visible) {
      createTimer()
    }
  })

  usePrestoUiEvent('surfaceInteraction', props.player, () => {
    if (!props.player.slideInMenuVisible) {
      setControlsVisible(true)
      createTimer()
    }
  })

  const interactionTimerCallback = () => {
    setControlsVisible(false)
  }

  function createTimer(): void {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    if (controlsVisible) {
      timer.current = setTimeout(interactionTimerCallback, (props.hideDelay || DEFAULT_HIDE_DELAY) * 1000)
    }
  }

  useEffect(() => {
    createTimer()

    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
  }) // TODO fix this!!!!

  useEffect(() => {
    const onFocusIn = () => {
      if (ref.current) {
        const focusItems = getFocusableElements(ref.current)
        const index = focusItems.indexOf(document.activeElement as HTMLElement)
        if (index >= 0) {
          setLastFocusIndex(index)
        }
      }
    }

    if (ref.current) {
      ref.current.addEventListener('focusin', onFocusIn)
    }

    if (controlsVisible && ref.current) {
      const focusItems = getFocusableElements(ref.current)
      const index = focusItems.indexOf(document.activeElement as HTMLElement)
      if (index < 0) {
        if (lastFocusIndex >= 0 && lastFocusIndex < focusItems.length) {
          focusElement(focusItems[lastFocusIndex])
        } else {
          focusNextElement(focusItems)
        }
      }
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('focusin', onFocusIn)
      }
    }
  }) // TODO fix this!!!

  const mouseMove = () => {
    createTimer()
  }

  return (
    <div ref={ref}
      className={`pp-ui-controls ${isIpadOS() ? 'pp-ui-ipad' : ''} ${controlsVisible ? 'pp-ui-controls-visible' : ''}${props.className || ''}`}
      style={props.style}
      onMouseMove={mouseMove}
    >
      {props.children}
    </div>
  )
}

export default PlayerControls
