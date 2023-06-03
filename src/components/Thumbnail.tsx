import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.thumbnails'
import React, {
  CSSProperties,
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
  useContext,
  useMemo,
} from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoUiEvent } from '../react'

import type { BaseComponentProps } from '../utils'

export interface ThumbnailProps extends BaseComponentProps {
  position?: number
  listenToHover?: boolean
  moveRelativeToParent?: boolean
  style?: CSSProperties
  onThumbSize?: (width: number, height: number) => void
}

/**
 * @returns thumbnails plugin
 */
const usePlugin = () => {
  const { presto } = useContext(PrestoContext)
  return presto.getPlugin(clpp.thumbnails.ThumbnailsPlugin.Id) as clpp.ThumbnailsPlugin | null
}

const DEFAULT_STYLE = { height: 130 }

/**
 * Thumbnail.
 * A UI for thumbnail images intended to be displayed when hovering over the seek bar.
 */
export const Thumbnail = (props: ThumbnailProps) => {
  const plugin = usePlugin()
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverPosition, setHoverPosition] = useState<number|null>(null)
  const [hoverValue, setHoverValue] = useState<number>(0)
  const [thumbnailElement, setThumbnailElement] = useState<HTMLElement|null>(null)
  const widthRef = useRef(0)

  const clearThumbnail = useCallback(() => {
    setThumbnailElement(null)
  }, [])

  const loadThumbnail =  useCallback(async (position: number) => {
    if (!plugin) {return}
  
    const thumb = await plugin.get(position)
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
  }, [props.onThumbSize, plugin])

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

  usePrestoUiEvent('hoverPosition', (event) => {
    if (props.listenToHover === false) {return}
    setHoverPosition(event.position)
    setHoverValue(event.percent)
  }, [props.listenToHover])

  useLayoutEffect(() => {
    const position = hoverPosition ?? props.position

    if (position == null || position < 0) {
      clearThumbnail()
    } else {
      loadThumbnail(position).catch(() => {})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverPosition, props.position])

  // Keep last width value cached, even if I do not have any thumbnail to
  // display to prevent UI glitches caused by changing width of this element.
  widthRef.current = getThumbSize(thumbnailElement)?.width ?? widthRef.current

  const style: CSSProperties = useMemo(() => ({
    width: widthRef.current,
    ...props.moveRelativeToParent ? {
      position: 'absolute',
      margin: 'auto',
      left: `calc((100% - ${widthRef.current ?? 0}px) * ${hoverValue}/100) `,
      transform: 'translateY(-50%)',
    } : {},
    ...props.style ?? DEFAULT_STYLE,
  }), [ props.moveRelativeToParent, props.style, hoverValue])

  return (
    <div ref={containerRef}
      data-testid="pp-ui-thumbnail"
      style={style}
      className={`pp-ui pp-ui-thumbnail ${thumbnailElement ? 'pp-ui-thumbnail-with-thumb': ''} ${props.className || ''}`}
      dangerouslySetInnerHTML={{ __html: thumbnailElement?.outerHTML ?? '' }} 
    ></div>
  )
}
