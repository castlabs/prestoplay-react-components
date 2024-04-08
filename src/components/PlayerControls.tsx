import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { useControlsVisible } from '../react'
import { ControlsVisibilityMode } from '../services/controls'
import {
  focusElement,
  focusNextElement,
  getFocusableElements, isIpadOS,
} from '../utils'

import type { BaseComponentProps } from './types'

export interface PlayerControlsProps extends BaseComponentProps {
  /**
   * Time in milliseconds after which the controls will be automatically hidden.
   * This applies only when the mode is set to 'auto'.
   * 
   * Defaults to 3000.
   */
  hideDelay?: number
  /**
   * Visibility mode of the content. If set to 'auto' the content appears 
   * based on user interaction with the player or when the player is paused,
   * and it automatically hides after the specified delay.
   * 
   * Defaults to 'auto'.
   */
  mode?: ControlsVisibilityMode
  /**
   * Content to display. This is intended to be used for player controls.
   */
  children?: React.ReactNode
}

/**
 * Player Controls.
 * A horizontal area component that contains player controls.
 */
export const PlayerControls = (props: PlayerControlsProps) => {
  const [lastFocusIndex, setLastFocusIndex] = useState(-1)
  const { player } = useContext(PrestoContext)
  const controlsVisible = useControlsVisible() && props.mode !== 'never'

  useEffect(() => {
    if (props.hideDelay) {
      player.controlsAutoHideDelayMs = props.hideDelay
    }
  }, [player, props.hideDelay])

  useEffect(() => {
    player.controlsVisibilityMode = props.mode ?? 'auto'
  }, [player, props.mode])

  const ref = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={ref}
      data-testid="pp-ui-controls" 
      className={`pp-ui-controls ${isIpadOS() ? 'pp-ui-ipad' : ''}`
        + ` ${controlsVisible ? 'pp-ui-controls-visible' : ''} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </div>
  )
}
