import React, {useEffect, useState} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {usePrestoEnabledState} from "../react";

const REQUEST_FULLSCREEN = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen',
  'webkitEnterFullscreen'
];

const EXIT_FULLSCREEN = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen',
  'webkitExitFullscreen'
];

const FULLSCREEN_ELEMENT = [
  'fullscreenElement',
  'webkitFullscreenElement',
  'webkitCurrentFullScreenElement',
  'mozFullScreenElement',
  'msFullscreenElement',
  'webkitDisplayingFullscreen'
];

const FULLSCREEN_CHANGE = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange',
  'webkitbeginfullscreen',
  'webkitendfullscreen'
];

export interface FullscreenButtonProps extends BasePlayerComponentButtonProps {
  fullscreenContainer: React.MutableRefObject<HTMLElement | null>;
}

const isFullscreenEnabled = () => {
  return !!FULLSCREEN_ELEMENT.find(name => {
    // @ts-ignore
    return document[name] != undefined
  });
}

const findApi = (element: any, choices: string[]) => {
  return choices.find(name => {
    // @ts-ignore
    return typeof element[name] === 'function';
  });
}


export const FullscreenButton = (props: FullscreenButtonProps) => {
  let [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  let enabled = usePrestoEnabledState(props.player);


  const requestFullscreen = () => {
    let element = props.fullscreenContainer.current;
    if (!element) return

    let name = findApi(element, REQUEST_FULLSCREEN);
    if (!name) {
      // we could not find a valid fullscreen API on the provided element
      // This can happen, for instance, on iOS, where only the video element
      // can be put in fullscreen.
      //
      // Here we search for a nested video element and try to put that into
      // fullscreen
      let videoElement = element.querySelector("video");
      if(!videoElement) {
        return
      }
      element = videoElement
      name = findApi(element, REQUEST_FULLSCREEN);
      if(!name) {
        return
      }
    }

    // @ts-ignore
    return element[name].call(element);
  }

  const exitFullscreen = () => {
    const name = findApi(document, EXIT_FULLSCREEN);
    if (!name) return
    // @ts-ignore
    return document[name].call(document);
  }

  function toggle() {
    let element = props.fullscreenContainer.current;
    if (element) {
      if (!fullscreen) {
        requestFullscreen()
        setFullscreen(true)
      } else {
        exitFullscreen()
        setFullscreen(false)
      }
    }
  }

  const onFullscreenChangeListener = () => {
    setFullscreen(isFullscreenEnabled())
  };

  useEffect(() => {
    FULLSCREEN_CHANGE.forEach(name => {
      document.addEventListener(name, onFullscreenChangeListener)
    })
    return () => {
      FULLSCREEN_CHANGE.forEach(name => {
        document.removeEventListener(name, onFullscreenChangeListener)
      })
    }
  })

  useEffect(() => {
    // we _might_ need to use the video element to go fullscreen
    // so let's attach fullscreen listeners explicitly.
    // This is needed at least on iOS
    let element = props.fullscreenContainer.current;
    if (!element) return
    let videoElement = element.querySelector("video");
    if (!videoElement) return
    FULLSCREEN_CHANGE.forEach(name => {
      // @ts-ignore
      videoElement.addEventListener(name, onFullscreenChangeListener)
    })
    return () => {
      FULLSCREEN_CHANGE.forEach(name => {
        // @ts-ignore
        videoElement.removeEventListener(name, onFullscreenChangeListener)
      })
    }
  }, [props.fullscreenContainer])

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon}
                disabled={!enabled}
                className={`pp-ui-fullscreen pp-ui-fullscreen-${fullscreen ? "enabled" : "disabled"} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default FullscreenButton
