import React, {createRef, useEffect, useRef, useState} from "react";
import {BasePlayerComponentProps} from "../utils";
import {usePrestoUiEvent} from "../react";

const DEFAULT_HIDE_DELAY = 5

export interface PlayerControlsProps extends BasePlayerComponentProps {
  hideDelay?: number
}

export const PlayerControls = (props: PlayerControlsProps) => {
  let [controlsVisible, setControlsVisible_] = useState(props.player.controlsVisible);
  const timer = useRef<any>(null);
  const ref = createRef<HTMLDivElement>();

  const setControlsVisible = (visible: boolean, fromUiEvent: boolean = false) => {
    if(!fromUiEvent) {
      props.player.controlsVisible = visible
    }
    setControlsVisible_(visible)
  }

  usePrestoUiEvent("controlsVisible", props.player, (visible) => {
    setControlsVisible(visible, true)
  })

  usePrestoUiEvent("slideInMenuVisible", props.player, (visible) => {
    setControlsVisible(!visible)
  })

  usePrestoUiEvent("surfaceInteraction", props.player, () => {
    setControlsVisible(true)
    createTimer()
  })

  const interactionTimerCallback = () => {
    if (ref.current) {
      // we are supposed to hide the setting because the interaction timer
      // ran out, but we should only do this if there is either no active
      // element or the active element is not inside the controls.
      if (document.activeElement &&
        (document.activeElement == ref.current ||
          ref.current.contains(document.activeElement))) {
        createTimer();
        return
      }
    }
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

  const mouseMove = () => {
    createTimer()
  }

  return (
    <div ref={ref}
      className={`pp-ui-controls ${controlsVisible ? "pp-ui-controls-visible" : ""}${props.className || ''}`}
      onMouseMove={mouseMove}
    >
      {props.children}
    </div>
  );
}

export default PlayerControls
