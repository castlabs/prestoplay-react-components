import React, {
  createRef, CSSProperties,
  useLayoutEffect,
  useState
} from "react";
import {
  BasePlayerComponentProps,
} from "../utils";
import {usePrestoEvent, usePrestoUiEvent} from "../Player";
// @ts-ignore
import {clpp} from '@castlabs/prestoplay'


export interface ThumbnailProps extends BasePlayerComponentProps {
  position?: number,
  listenToHover?: boolean,
  moveRelativeToParent?: boolean,
  style?: CSSProperties,
  onThumbSize?: (width:number, height:number) => void
}

export const Thumbnail = (props: ThumbnailProps) => {
  let [thumbsPlugin, setThumbsPlugin] = useState<any>()
  let [hasThumb, setHasThumb] = useState<boolean>(false)
  let [thumbWidth, setThumbWidth] = useState<number>(0)
  let containerRef = createRef<HTMLDivElement>()
  let [hoverPosition, setHoverPosition] = useState<number>(-1)
  let [hoverValue, setHoverValue] = useState<number>(0)

  const loadThumbnail = () => {
    if (!thumbsPlugin) {
      return
    }
    let container = containerRef.current;
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

    let finalPosition = hasHoverPosition ? hoverPosition : props.position
    thumbsPlugin.get(finalPosition)
      .then((t: any) => t.load())
      .then((t: any) => t.element())
      .then((child: HTMLElement) => {
        if(!container) return;


        let imageWidth = Number(child.style.width.replace('px', ''));
        let imageHeight = Number(child.style.height.replace('px', ''));
        let containerWidth = container.clientWidth;
        let containerHeight = container.clientHeight;
        let scale = containerHeight / imageHeight
        container.style.width = (imageWidth * scale) + "px"

        // let scale = Math.min(
        //   containerWidth / imageWidth,
        //   containerHeight / imageHeight
        // );
        child.style.transformOrigin = "top left";
        child.style.transform = "scale(" + scale +") translateY(-50%)";
        child.style.backgroundColor = 'transparent';
        child.style.position = 'absolute';
        child.style.top = '50%';

        if(props.onThumbSize) {
          props.onThumbSize((imageWidth * scale), containerHeight)
        }
        setThumbWidth((imageWidth * scale))
        setHasThumb(true)
        container.replaceChildren(child)
      })
      .catch((e: any) => {
      })
  }

  usePrestoEvent("loadeddata", props.player, (e, presto) => {
    setThumbsPlugin(presto.getPlugin(clpp.thumbnails.ThumbnailsPlugin.Id));
  })

  usePrestoUiEvent("hoverPosition", props.player, (data) => {
    if (!props.listenToHover) return
    setHoverPosition(data.position)
    setHoverValue(data.percent)
  })

  useLayoutEffect(() => {
    loadThumbnail()
  }, [thumbsPlugin, containerRef, hoverPosition])

  let trackParentStyle = ():CSSProperties => {
    if(!props.moveRelativeToParent) return {}
    return {
      position: "absolute",
      margin: "auto",
      left: `calc((100% - ${thumbWidth}px) * ${hoverValue}/100) `,
      transform: "translateY(-50%)"
    }
  }

  return (
    <div ref={containerRef}
         style={{
           ...trackParentStyle(),
           ...props.style || {}
         }}
         className={`pp-ui pp-ui-thumbnail ${hasThumb ? 'pp-ui-thumbnail-with-thumb': ''} ${props.className || ''}`}>
    </div>
  )
}

export default Thumbnail
