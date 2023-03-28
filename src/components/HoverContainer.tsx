import React, {
  createRef, CSSProperties, useLayoutEffect, useState,
} from 'react'
import '@castlabs/prestoplay/cl.thumbnails'

import { usePrestoUiEvent } from '../react'
import {
  BasePlayerComponentProps,
} from '../utils'


export interface HoverContainerProps extends BasePlayerComponentProps {
  listenToHover?: boolean
  style?: CSSProperties
  notTrackFullWidth?: boolean
  targetRef?: React.MutableRefObject<HTMLElement | null>
}

export const HoverContainer = (props: HoverContainerProps) => {
  const containerRef = createRef<HTMLDivElement>()
  const ref = createRef<HTMLDivElement>()
  const [hoverValue, setHoverValue] = useState<number>(-1)

  usePrestoUiEvent('hoverPosition', props.player, (data) => {
    if (!props.listenToHover) {return}
    setHoverValue(data.percent)
  })

  const trackParentStyle = (): CSSProperties => {
    return {
      display: (props.listenToHover && hoverValue < 0) ? 'none' : 'block',
    }
  }

  useLayoutEffect(() => {
    if(ref.current && containerRef.current) {
      const width = ref.current.offsetWidth
      let containerWidth = containerRef.current.clientWidth
      const relPos = hoverValue / 100.0
      const maxPosition = containerWidth - width - 1
      let targetPosition = 0

      if(props.targetRef && props.targetRef.current) {
        containerWidth = props.targetRef.current?.clientWidth
      }

      if(props.notTrackFullWidth) {
        targetPosition = ((containerWidth - width) * relPos)
      } else {
        targetPosition = (containerWidth * relPos) - (width / 2)
      }

      if (props.targetRef && props.targetRef.current) {
        targetPosition += props.targetRef.current?.getBoundingClientRect().x
      }
      const position = Math.min(maxPosition, Math.max(0, targetPosition))
      containerRef.current.style.transform = `translateX(${position}px)`
    }
  }, [ref, containerRef, props.targetRef])


  return (
    <div ref={containerRef}
      style={{
        ...trackParentStyle(),
        ...props.style || {},
      }}
      className={`pp-ui pp-ui-hover-container ${props.className || ''}`}>
      <div ref={ref} className={'pp-ui-hover-container-content'}>
        {props.children}
      </div>
    </div>
  )
}

export default HoverContainer
