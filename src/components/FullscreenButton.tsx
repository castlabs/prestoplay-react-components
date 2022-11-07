import React, {useEffect, useState} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {usePrestoEnabledState} from "../react";

export interface FullscreenButtonProps extends BasePlayerComponentButtonProps{
  fullscreenContainer: React.MutableRefObject<HTMLElement | null>;
}

export const FullscreenButton = (props: FullscreenButtonProps) => {
  let [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  let enabled = usePrestoEnabledState(props.player);

  function toggle() {
    if(props.fullscreenContainer.current) {
      if(!fullscreen) {
        props.fullscreenContainer.current.requestFullscreen()
        setFullscreen(true)
      } else {
        document.exitFullscreen()
        setFullscreen(false)
      }
    }
  }

  useEffect(() => {
    let handler = () => {
      if (document.fullscreenElement) {
        setFullscreen(true)
      } else {
        setFullscreen(false)
      }
    };
    document.addEventListener("fullscreenchange", handler)
    return () => {
      document.removeEventListener("fullscreenchange", handler)
    }
  })

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon} disabled={!enabled}
                className={`pp-ui-fullscreen pp-ui-fullscreen-${fullscreen ? "enabled" : "disabled"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default FullscreenButton
