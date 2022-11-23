import React, {
  createRef,
  useEffect,
  useRef,
  useState
} from "react";
import {
  BasePlayerComponentProps, focusElement,
  focusNextElement,
  getFocusableElements, isIpadOS
} from "../utils";
import {usePrestoUiEvent} from "../react";

const DEFAULT_HIDE_DELAY = 5

export interface PlayerControlsProps extends BasePlayerComponentProps {
  hideDelay?: number,
  showWhenDisabled?: boolean
}

export const PlayerControls = (props: PlayerControlsProps) => {
  let [controlsVisible, setControlsVisible_] = useState(props.player.controlsVisible || (props.showWhenDisabled && !props.player.enabled));
  let [lastFocusIndex, setLastFocusIndex] = useState(-1);

  const timer = useRef<any>(null);
  const ref = createRef<HTMLDivElement>();

  const setControlsVisible = (visible: boolean, fromUiEvent: boolean = false) => {
    if(!fromUiEvent) {
      props.player.controlsVisible = visible
    }
    controlsVisible = visible
    setControlsVisible_(visible)
  }

  usePrestoUiEvent("controlsVisible", props.player, (visible) => {
    setControlsVisible(visible, true)
    if (visible) {
      createTimer()
    }
  })

  usePrestoUiEvent("slideInMenuVisible", props.player, (visible) => {
    setControlsVisible(!visible)
    if(!visible) {
      createTimer()
    }
  })

  usePrestoUiEvent("surfaceInteraction", props.player, () => {
    if(!props.player.slideInMenuVisible) {
      setControlsVisible(true)
      createTimer()
    }
  })

  const interactionTimerCallback = () => {
    setControlsVisible(false)
  }

  function createTimer():void {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    if(controlsVisible) {
      timer.current = setTimeout(interactionTimerCallback, (props.hideDelay || DEFAULT_HIDE_DELAY) * 1000);
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
  })

  useEffect(() => {
    let onFocusIn = () => {
      if(ref.current) {
        let focusItems = getFocusableElements(ref.current);
        let index = focusItems.indexOf(document.activeElement as HTMLElement)
        if(index >= 0) {
          setLastFocusIndex(index)
        }
      }
    }

    if(ref.current) {
      ref.current.addEventListener("focusin", onFocusIn)
    }


    if (controlsVisible && ref.current) {
      let focusItems = getFocusableElements(ref.current);
      let index = focusItems.indexOf(document.activeElement as HTMLElement)
      if (index < 0) {
        if (lastFocusIndex >= 0 && lastFocusIndex < focusItems.length) {
          focusElement(focusItems[lastFocusIndex])
        } else {
          focusNextElement(focusItems)
        }
      }
    }
    return () => {
      if(ref.current) {
        ref.current.removeEventListener("focusin", onFocusIn)
      }
    }
  })

  const mouseMove = () => {
    createTimer()
  }

  return (
    <div ref={ref}
      className={`pp-ui-controls ${isIpadOS() ? 'pp-ui-ipad' : ''} ${controlsVisible ? "pp-ui-controls-visible" : ""}${props.className || ''}`}
         style={props.style}
      onMouseMove={mouseMove}
    >
      {props.children}
    </div>
  );
}

export default PlayerControls
