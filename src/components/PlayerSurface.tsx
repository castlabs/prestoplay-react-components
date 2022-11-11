import React, {
  createRef,
  ForwardedRef, forwardRef,
  useEffect, useRef
} from "react";
import {
  BasePlayerComponentProps, focusElement,
  focusNextElement, focusPreviousElement,
  getFocusableElements, isIpadOS
} from "../utils";
import {usePrestoUiEvent} from "../react";

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
  /**
   * Pass the plays inline flag to the video element. This is relevant for mobile
   * and iPad devices to decide if the playback can start embedded in the page or the
   * player will go to full-screen mode and no overlay will be possible
   */
  playsInline?: boolean
}

/**
 * The Player Surface receives they player instance and a configuration
 * and renders the related video element. The component can be referenced, and
 * that ref can be use for instance to initiate full screen playback
 */
export const PlayerSurface = forwardRef<HTMLDivElement, PlayerProps>((props: PlayerProps, ref: ForwardedRef<HTMLDivElement>) => {
  const video = createRef<HTMLVideoElement>();
  const containerRef = useRef<HTMLDivElement>()

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


  function maybeFocusSurface(forceSurfaceFocus?: boolean) {
    if (containerRef.current) {
      let element: HTMLDivElement = containerRef.current
      let items = getFocusableElements(element)
      let index = items.indexOf(document.activeElement as HTMLElement);
      const surfaceFocused = document.activeElement == element;
      if ((index == -1 && !surfaceFocused) || forceSurfaceFocus) {
        focusElement(element)
      }
    }
  }

  usePrestoUiEvent("surfaceInteraction", props.player, () => {
    maybeFocusSurface();
  })

  usePrestoUiEvent("controlsVisible", props.player, (visible) => {
    if (!visible && !props.player.slideInMenuVisible) {
      maybeFocusSurface(true);
    }
  })

  const mouseMove = (e:React.MouseEvent) => {
    if (!props.player.controlsVisible && !props.player.slideInMenuVisible) {
      props.player.surfaceInteraction()
    }
  }

  const mouseClick = (e:React.MouseEvent) => {
    if(!e.defaultPrevented) {
      if(props.player.slideInMenuVisible) {
        props.player.slideInMenuVisible = false
        e.preventDefault()
      } else if(props.player.controlsVisible) {
        props.player.controlsVisible = false
        e.preventDefault()
      } else {
        props.player.surfaceInteraction()
        e.preventDefault()
      }
    }
  }

  const onKeyDown = async (e:React.KeyboardEvent) => {
    if(e.defaultPrevented) return

    if(containerRef && containerRef.current) {
      // console.log('>>> Player Surface Key Down:', {code:e.code, key:e.key}, 'register surface interaction')

      let element:HTMLDivElement = containerRef.current
      let items = getFocusableElements(element)

      if(e.code == "ArrowDown") {
        focusNextElement(items)
        e.preventDefault()
        props.player.surfaceInteraction()
      } else if(e.code == "ArrowUp") {
        focusPreviousElement(items)
        e.preventDefault()
        props.player.surfaceInteraction()
      } else if (e.code == 'Escape') {
        if (props.player.slideInMenuVisible) {
          props.player.slideInMenuVisible = false
          props.player.controlsVisible = false
          maybeFocusSurface(true)
        } else if(props.player.controlsVisible) {
          props.player.controlsVisible = false
          maybeFocusSurface(true)
        } else {
          props.player.surfaceInteraction()
        }
      }

    }

    // let player = props.player;
    // switch (e.code) {
    //   case "ArrowRight":
    //     player.position += 10
    //     break
    //   case "ArrowLeft":
    //     player.position -= 10
    //     break
    //   case "Space":
    //     player.playing = !player.playing
    //     e.preventDefault()
    //     break
    //   case "Escape":
    //     if (props.player.slideInMenuVisible) {
    //       console.log('>>> ESCAPE, close menu and register interaction')
    //       props.player.slideInMenuVisible = false
    //       setTimeout(() => {
    //         props.player.surfaceInteraction()
    //       }, 100)
    //       e.preventDefault()
    //     }
    //     break
    // }
  }

  useEffect(() => {
    // @ts-ignore
    if(window.tizen) {
      // @ts-ignore
      window.tizen.mediakey.setMediaKeyEventListener({
        onpressed: function(key:string) {
          console.log("Pressed key: " + key);
          if (key == "MEDIA_PLAY") {
            props.player.playing = true
          }else if (key == "MEDIA_PAUSE") {
            props.player.playing = false
          }
        },
        onreleased: function(key:string) {
          console.log("Released key: " + key);
        }
      });
    }
    return () => {
      // @ts-ignore
      if(window.tizen){
        // @ts-ignore
        window.tizen.mediakey.unsetMediaKeyEventListener();
      }
    }
  })

  const handleContainerRef = (c:HTMLDivElement) => {
    containerRef.current = c
    if (typeof ref === 'function') {
      ref(c);
    } else if (ref) {
      ref.current = c;
    }
  }

  return (
    <div ref={handleContainerRef}
         className={`pp-ui pp-ui-surface ${isIpadOS() ? 'pp-ui-ipad' : ''} ${props.className || ''}`}
         style={props.style}
         onClick={mouseClick}
         // onMouseMove={mouseMove}
         onKeyDown={onKeyDown}
         tabIndex={0}
    >
      <video className={"pp-ui pp-ui-video"}
             ref={video}
             tabIndex={-1}
             playsInline={props.playsInline}>
      </video>
      <div className={`pp-ui pp-ui-overlay ${isIpadOS() ? 'pp-ui-ipad' : ''}`}>
        {props.children}
      </div>
    </div>
  )
})

export default PlayerSurface
