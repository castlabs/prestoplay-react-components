import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.thumbnails'
import React, {
  createRef, CSSProperties,
  useLayoutEffect,
  useState,
} from 'react'

import { usePresto, usePrestoUiEvent } from '../react'
import {
  BasePlayerComponentProps,
} from '../utils'


Document.prototype.replaceChildren ||= replaceChildren
DocumentFragment.prototype.replaceChildren ||= replaceChildren
Element.prototype.replaceChildren ||= replaceChildren

function replaceChildren(...new_children:any) {
  // @ts-ignore
  const { childNodes } = this
  while (childNodes.length) {
    childNodes[0].remove()
  }
  // @ts-ignore
  this.append(...new_children)
}

export interface ThumbnailProps extends BasePlayerComponentProps {
  position?: number
  listenToHover?: boolean
  moveRelativeToParent?: boolean
  style?: CSSProperties
  onThumbSize?: (width:number, height:number) => void
}

export const Thumbnail = (props: ThumbnailProps) => {
  const [thumbsPlugin, setThumbsPlugin] = useState<any>()
  const [hasThumb, setHasThumb] = useState<boolean>(false)
  const [thumbWidth, setThumbWidth] = useState<number>(0)
  const containerRef = createRef<HTMLDivElement>()
  const [hoverPosition, setHoverPosition] = useState<number>(-1)
  const [hoverValue, setHoverValue] = useState<number>(0)

  const loadThumbnail = () => {
    if (!thumbsPlugin) {
      return
    }
    const container = containerRef.current
    if (!container) {
      return
    }
    const hasHoverPosition = props.listenToHover && hoverPosition >= 0
    const hasPosition = props.position != null && props.position >= 0

    if (!hasPosition  && !hasHoverPosition) {
      setHasThumb(false)
      container.replaceChildren()
      return
    }

    const finalPosition = hasHoverPosition ? hoverPosition : props.position
    thumbsPlugin.get(finalPosition)
      .then((t: any) => t.load())
      .then((t: any) => t.element())
      .then((child: HTMLElement) => {
        if(!container) {return}


        const imageWidth = Number(child.style.width.replace('px', ''))
        const imageHeight = Number(child.style.height.replace('px', ''))
        // const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const scale = containerHeight / imageHeight
        container.style.width = `${(imageWidth * scale)}px`

        // let scale = Math.min(
        //   containerWidth / imageWidth,
        //   containerHeight / imageHeight
        // );
        child.style.transformOrigin = 'top left'
        child.style.transform = `scale(${scale}) translateY(-50%)`
        child.style.backgroundColor = 'transparent'
        child.style.position = 'absolute'
        child.style.top = '50%'

        if(props.onThumbSize) {
          props.onThumbSize((imageWidth * scale), containerHeight)
        }
        setThumbWidth((imageWidth * scale))
        setHasThumb(true)
        container.replaceChildren(child)
      })
      .catch(() => {
        // nothing
      })
  }

  usePresto(props.player, (presto) => {

    setThumbsPlugin(presto.getPlugin(clpp.thumbnails.ThumbnailsPlugin.Id))
  })

  usePrestoUiEvent('hoverPosition', props.player, (data) => {
    if (!props.listenToHover) {return}
    setHoverPosition(data.position)
    setHoverValue(data.percent)
  })

  useLayoutEffect(() => {
    loadThumbnail()
  }, [thumbsPlugin, containerRef, hoverPosition])

  const trackParentStyle = (): CSSProperties => {
    if(!props.moveRelativeToParent) {return {}}
    return {
      position: 'absolute',
      margin: 'auto',
      left: `calc((100% - ${thumbWidth}px) * ${hoverValue}/100) `,
      transform: 'translateY(-50%)',
    }
  }

  return (
    <div ref={containerRef}
      style={{
        ...trackParentStyle(),
        ...props.style || {},
      }}
      className={`pp-ui pp-ui-thumbnail ${hasThumb ? 'pp-ui-thumbnail-with-thumb': ''} ${props.className || ''}`}>
    </div>
  )
}

export default Thumbnail
