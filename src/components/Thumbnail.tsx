import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.thumbnails'
import React, {
  CSSProperties,
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
} from 'react'

import { usePresto, usePrestoUiEvent } from '../react'
import {
  BasePlayerComponentProps,
} from '../utils'

export interface ThumbnailProps extends BasePlayerComponentProps {
  position?: number
  listenToHover?: boolean
  moveRelativeToParent?: boolean
  style?: CSSProperties
  onThumbSize?: (width: number, height: number) => void
}

export const Thumbnail = (props: ThumbnailProps) => {
  const pluginRef = useRef<clpp.ThumbnailsPlugin|null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverPosition, setHoverPosition] = useState<number|null>(null)
  const [hoverValue, setHoverValue] = useState<number>(0)
  const [thumbnailElement, setThumbnailElement] = useState<HTMLElement|null>(null)

  const clearThumbnail = useCallback(() => {
    setThumbnailElement(null)
  }, [])

  const loadThumbnail =  useCallback(async (position: number) => {
    if (!pluginRef.current) {
      return
    }
  
    const thumb = await pluginRef.current.get(position)
    if (!thumb) {return}

    await thumb.load()

    const element = thumb.element()
    const size = getThumbSize(element)
    if (!size) {return}

    // Style the thumbnail
    // let scale = Math.min(
    //   containerWidth / imageWidth,
    //   containerHeight / imageHeight
    // );
    element.style.transformOrigin = 'top left'
    element.style.transform = `scale(${size.scale}) translateY(-50%)`
    element.style.backgroundColor = 'transparent'
    element.style.position = 'absolute'
    element.style.top = '50%'

    props.onThumbSize?.(size.width, size.containerHeight)
    setThumbnailElement(element)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onThumbSize])

  const getThumbSize = (el: HTMLElement | null) => {
    if (!el) {return null}
    const containerHeight = containerRef.current?.clientHeight
    if (!containerHeight) {return null}

    const imageWidth = Number(el.style.width.replace('px', ''))
    const imageHeight = Number(el.style.height.replace('px', ''))
    if (!imageHeight || !imageHeight) { return null}

    const scale = containerHeight / imageHeight

    return {
      width: imageWidth * scale,
      height: imageHeight * scale,
      scale,
      containerHeight,
    }
  }

  usePresto(props.player, (presto) => {
    pluginRef.current = presto.getPlugin(clpp.thumbnails.ThumbnailsPlugin.Id) as clpp.ThumbnailsPlugin | null
  })

  usePrestoUiEvent('hoverPosition', props.player, (data) => {
    if (!props.listenToHover) {return}
    setHoverPosition(data.position)
    setHoverValue(data.percent)
  })

  useLayoutEffect(() => {
    const position = hoverPosition ?? props.position

    if (position == null || position < 0) {
      clearThumbnail()
    } else {
      loadThumbnail(position).catch(() => {})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverPosition, props.position])

  const size = getThumbSize(thumbnailElement)
  const trackParentStyle = (): CSSProperties => {
    if (!props.moveRelativeToParent) {return {}}

    return {
      position: 'absolute',
      margin: 'auto',
      left: `calc((100% - ${size?.width ?? 0}px) * ${hoverValue}/100) `,
      transform: 'translateY(-50%)',
    }
  }

  return (
    <div ref={containerRef}
      style={{
        ...trackParentStyle(),
        ...props.style ?? {},
        ...size ? { width: size.width } : {},
      }}
      className={`pp-ui pp-ui-thumbnail ${thumbnailElement ? 'pp-ui-thumbnail-with-thumb': ''} ${props.className || ''}`}
      dangerouslySetInnerHTML={{ __html: thumbnailElement?.outerHTML ?? '' }} 
    ></div>
  )
}
