import React, {
  CSSProperties, useCallback, useMemo, useRef,
} from 'react'
import '@castlabs/prestoplay/cl.thumbnails'

import { useHoverPercent } from '../hooks/hooks'
import { clamp } from '../utils/math'

import type { BaseComponentProps } from '../utils'

export interface HoverContainerProps extends BaseComponentProps {
  style?: CSSProperties
  /**
   * If `targetRef` is passed, children will be positioned horizontally
   * relative to the referenced target element.
   * By default children are positioned relative to top element of
   * the `HoverContainer`.
   */
  targetRef?: React.MutableRefObject<HTMLElement | null>
  children?: React.ReactNode
}

const debug = false
const MIN_SAFE_WIDTH = 20

/**
 * Hover container.
 * 
 * This component is intended for displaying thumbnails above
 * the seek bar. It positions its children horizontally based
 * on the current hover position.
 */
export const HoverContainer = (props: HoverContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const hoverPercent = useHoverPercent()

  /**
   * Calculate the horizontal position of child element
   * based on the current hover value.
   * 
   * @see {@link docs/hover_container.drawio} where this calculation
   *  is explained in more detail.
   */
  const calculateChildPosition = useCallback((): number | null => {
    const child = ref.current
    const container = containerRef.current
    const targetEl = (props.targetRef?.current ?? null) as HTMLElement | null
    if (!child || !container || hoverPercent == null) {
      return null
    }
    const target = targetEl ?? container

    const childWidth = child.offsetWidth
    const targetWidth = target.clientWidth
    const containerWidth = container.clientWidth
    const targetX = target.getBoundingClientRect().x
    const containerX = container.getBoundingClientRect().x
    const childWidthHalf = childWidth / 2
    const shift = targetX - containerX

    if (childWidth <= MIN_SAFE_WIDTH || targetWidth <= MIN_SAFE_WIDTH || containerWidth <= MIN_SAFE_WIDTH) {
      return null
    }

    const minPosition = shift - childWidthHalf
    const maxPosition = shift + targetWidth - childWidthHalf
    const length = maxPosition - minPosition

    const position = clamp(minPosition + (length * (hoverPercent / 100.0)), 0, containerWidth - childWidth)
    return position
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.targetRef, hoverPercent])

  const style = useMemo((): CSSProperties => {
    return {
      display: 'block',
      ...props.style,
    }
  }, [props.style])

  const childStyle = useMemo((): CSSProperties => {
    const position = calculateChildPosition()

    if (position == null) {
      return debug ? {} : {
        visibility: 'hidden',
      }
    } else {
      return {
        transform: `translateX(${position}px)`,
      }
    }
  }, [calculateChildPosition])

  return (
    <div
      data-testid="pp-ui-hover-container"
      ref={containerRef}
      className={`pp-ui pp-ui-hover-container ${props.className ?? ''}`}
      style={style}
    >
      <div ref={ref} className={'pp-ui-hover-container-content'} style={childStyle}>
        {props.children}
      </div>
    </div>
  )
}
