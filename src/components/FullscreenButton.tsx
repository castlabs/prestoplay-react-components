import React, {useEffect, useState} from "react";
import {BasePlayerComponentButtonProps, isIOS, isIpadOS} from "../utils";
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
  /**
   * Reference to the container that will be displayed in fullscreen mode.
   * 
   * (Not all platforms support this, e.g. on iOS only the video element
   * can be displayed in fullscreen mode, so this props will be ignored there).
   */
  fullscreenContainer: React.MutableRefObject<HTMLElement | null>;
  /**
   * Configure whether the video element or the `fullscreenContainer` should
   * be displayed in fullscreen mode.
   * 
   * By default on iOS the video element will be displayed in fullscreen mode
   * and everywhere else the `fullscreenContainer` will be displayed in fullscreen mode.
   */
  useVideoElementForFullscreen?: UseVideoElement[]
}

/**
 * The fullscreen button will try to put the passed element to
 * fullscreen mode if that is possible. However, on some platforms, it is not
 * possible to put a random DOM element to fullscreen mode and instead the video
 * element needs to be put in fullscreen. This also means that no custom overlays
 * and controls are possible and that the native controls will be used.
 *
 * This is currently needed on iOS and can be enabled for iPadOS.
 */
export enum UseVideoElement {
  /**
   * Always use the video element for fullscreen mode
   */
  "Always"="Always",
  /**
   * Use the video element for fullscreen mode on iOS
   */
  "iOS"="iOS",
  /**
   * Use the fullscreen mode on iPadOS
   */
  "iPadOS"="iPadOS"
}

const isInFullScreen = () => {
  return FULLSCREEN_ELEMENT.some(name => {
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

const useVideoElementForFullscreen = (settings: UseVideoElement[]) => {
  const useVideoAlways = settings.indexOf(UseVideoElement.Always) >= 0;
  const useVideoOnIPad = settings.indexOf(UseVideoElement.iPadOS) >= 0;
  const useVideoOnIOs = settings.indexOf(UseVideoElement.iOS) >= 0;

  if (useVideoAlways) {
    return true
  }
  if(isIpadOS() && useVideoOnIPad) {
    return true
  }
  // noinspection RedundantIfStatementJS
  if(isIOS() && useVideoOnIOs) {
    return true
  }
  return false
}


export const FullscreenButton = (props: FullscreenButtonProps) => {
  let [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  let enabled = usePrestoEnabledState(props.player);


  const requestFullscreen = () => {
    let element = props.fullscreenContainer.current;
    if (!element) return

    let name = findApi(element, REQUEST_FULLSCREEN);
    let useVideoSettings = props.useVideoElementForFullscreen ?? [UseVideoElement.iOS]
    if (!name || useVideoElementForFullscreen(useVideoSettings)) {
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
    setFullscreen(isInFullScreen())
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
  }, [])

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
