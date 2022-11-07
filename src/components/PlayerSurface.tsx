import React, {
  createRef,
  ForwardedRef, forwardRef,
  useEffect
} from "react";
import {BasePlayerComponentProps} from "../utils";

/**
 * The properties of the player surface. This is the element that receives
 * the prestoplay configuration.
 */
export interface PlayerProps extends BasePlayerComponentProps {
  /**
   * The PRESTOplay player configuration
   */
  config?: any,

  /**
   * Indicate that the configuration should be applied immediately. If this is
   * set to false, the config will be passed to the player, but not applied
   * immediately.
   */
  autoload?: boolean
}

/**
 * The Player Surface receives they player instance and a configuration
 * and renders the related video element. The component can be referenced, and
 * that ref can be use for instance to initiate full screen playback
 */
export const PlayerSurface = forwardRef<HTMLDivElement, PlayerProps>((props: PlayerProps, ref: ForwardedRef<HTMLDivElement>) => {
  const video = createRef<HTMLVideoElement>();

  useEffect(() => {
    if (video.current) {
      props.player.init(video.current)
    }
    return () => {
      props.player.release()
    }
  }, [props.player, video.current])

  useEffect(() => {
    props.player.load(props.config, props.autoload)
  }, [props.config, props.player])

  const mouseMove = () => {
    if (!props.player.controlsVisible) {
      props.player.surfaceInteraction()
    }
  }
  const onKeyDown = async (e:React.KeyboardEvent) => {
    if(e.defaultPrevented) return
    let player = props.player;
    switch (e.code) {
      case "ArrowRight":
        player.position += 10
        break
      case "ArrowLeft":
        player.position -= 10
        break
      case "Space":
        player.playing = !player.playing
        e.preventDefault()
        break
    }
  }

  return (
    <div ref={ref}
         className={`pp-ui pp-ui-surface ${props.className || ''}`}
         style={props.style}
         onMouseMove={mouseMove}
         onKeyDown={onKeyDown}
         tabIndex={0}
    >
      <video className={"pp-ui pp-ui-video"} ref={video} tabIndex={-1}></video>
      <div className={"pp-ui pp-ui-overlay"}>
        {props.children}
      </div>
    </div>
  )
})

export default PlayerSurface
