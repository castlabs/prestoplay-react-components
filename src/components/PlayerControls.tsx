import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoUiEvent } from '../react'
import {
  BaseComponentProps, focusElement,
  focusNextElement,
  getFocusableElements, isIpadOS,
} from '../utils'

const DEFAULT_HIDE_DELAY = 5
const debug = false

export interface PlayerControlsProps extends BaseComponentProps {
  hideDelay?: number
  showWhenDisabled?: boolean
  children?: React.ReactNode
}

/**
 * Player Controls.
 * A horizontal area component that contains player controls.
 */
export const PlayerControls = (props: PlayerControlsProps) => {
  const { player } = useContext(PrestoContext)
  const [controlsVisible, setControlsVisible_] = useState(
    player.controlsVisible || (props.showWhenDisabled && !player.enabled))
  const [lastFocusIndex, setLastFocusIndex] = useState(-1)

  const timer = useRef<ReturnType<typeof setTimeout>|null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const setControlsVisible = (visible: boolean, fromUiEvent = false) => {
    if (!fromUiEvent) {
      player.controlsVisible = visible
    }
    setControlsVisible_(visible)
  }

  usePrestoUiEvent('controlsVisible', (visible) => {
    setControlsVisible(visible, true)
    if (visible) {
      createTimer()
    }
  })

  usePrestoUiEvent('slideInMenuVisible', (visible) => {
    setControlsVisible(!visible)
    if (!visible) {
      createTimer()
    }
  })

  usePrestoUiEvent('surfaceInteraction', () => {
    if (!player.slideInMenuVisible) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }) 

  const mouseMove = () => {
    createTimer()
  }

  return (
    <div ref={ref}
      data-testid="pp-ui-controls" 
      className={`pp-ui-controls ${isIpadOS() ? 'pp-ui-ipad' : ''}`
        + ` ${(controlsVisible || debug) ? 'pp-ui-controls-visible' : ''} ${props.className || ''}`}
      style={props.style}
      onMouseMove={mouseMove}
    >
      {props.children}
    </div>
  )
}
