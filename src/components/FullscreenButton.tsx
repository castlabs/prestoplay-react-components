import React, { useContext, useEffect, useMemo, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledState } from '../react'
import { fullscreen } from '../services/fullscreen'
import { isIOS, isIpadOS } from '../utils'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'


export interface FullscreenButtonProps extends BasePlayerComponentButtonProps {
  /**
   * Configure what element should be used for fullscreen mode.
   * By default it is the whole {@link PlayerSurface} except for iOS
   * where it is only the video element.
   */
  useVideoElementForFullscreen?: UseVideoElement[]
  children?: React.ReactNode
}

/**
 * The fullscreen button will try to put {@link PlayerSurface} to
 * fullscreen mode if that is possible.
 * However, on some platforms, it is not possible to put any DOM element
 * to fullscreen mode only video element supports that. In such cases
 * no custom overlays or controls are can be displayed in fullscreen mode,
 * only native controls will be used.
 *
 * This is currently needed on iOS and can be enabled for iPadOS.
 */
export enum UseVideoElement {
  /**
   * Always use the video element for fullscreen mode
   */
  'Always'='Always',
  /**
   * Use the video element for fullscreen mode on iOS
   */
  'iOS'='iOS',
  /**
   * Use the fullscreen mode on iPadOS
   */
  'iPadOS'='iPadOS',
}

const shouldUseVideoElementForFullscreen = (settings: UseVideoElement[]) => {
  const useVideoAlways = settings.indexOf(UseVideoElement.Always) >= 0
  const useVideoOnIPad = settings.indexOf(UseVideoElement.iPadOS) >= 0
  const useVideoOnIOs = settings.indexOf(UseVideoElement.iOS) >= 0

  if (useVideoAlways) {
    return true
  }
  if (isIpadOS() && useVideoOnIPad) {
    return true
  }
  // noinspection RedundantIfStatementJS
  if (isIOS() && useVideoOnIOs) {
    return true
  }
  return false
}

/**
 * @returns descendant video element or null
 */
const getVideoChild = (element: HTMLElement) => {
  return element.querySelector('video') ?? null
}

/**
 * This hook will return whether the element of its descendant video 
 * element is currently in fullscreen mode.
 */
export const useIsFullscreen = (playerSurface: HTMLElement | null) => {
  const [is, setIs] = useState(fullscreen.isInFullscreen())

  const listener = () => {
    setIs(fullscreen.isInFullscreen())
  }

  useEffect(() => {
    return fullscreen.addListener(document, listener)
  }, [])

  useEffect(() => {
    if (!playerSurface) {return}
    
    // we _might_ need to use the video element to go fullscreen
    // so let's attach fullscreen listeners explicitly.
    // This is needed at least on iOS
    const videoElement = getVideoChild(playerSurface)
    if (!videoElement) {return}

    return fullscreen.addListener(videoElement, listener)
  }, [playerSurface])

  return is
}

/**
 * This hooks returns true if the player is in fullscreen mode, false otherwise.
 */
export const useIsPlayerFullScreen = () => {
  const { playerSurface } = useContext(PrestoContext)
  const isFullscreen = useIsFullscreen(playerSurface)
  return isFullscreen
}

/**
 * Fullscreen button.
 * A button that brings the player into fullscreen mode.
 */
export const FullscreenButton = (props: FullscreenButtonProps) => {
  const enabled = usePrestoEnabledState()
  const { playerSurface } = useContext(PrestoContext)
  const isFullscreen = useIsFullscreen(playerSurface)

  /**
   * If we cannot find a valid fullscreen API on playerSurface,
   * then use the video element instead.
   * (This can happen, for instance, on iOS where only video elements
   * have support for fullscreen.)
   */
  const target = useMemo(() => {
    const shouldUseVideoElement = !fullscreen.canEnter(playerSurface) ||
      shouldUseVideoElementForFullscreen(props.useVideoElementForFullscreen ?? [UseVideoElement.iOS])

    if (shouldUseVideoElement) {
      return getVideoChild(playerSurface)
    } else {
      return playerSurface
    }
  }, [playerSurface, props.useVideoElementForFullscreen])

  const toggle = () => {
    if (!fullscreen.isSupported() || !target) {return}

    fullscreen.toggle(target)
  }

  return (
    <BaseButton
      testId="pp-ui-fullscreen-button"
      onClick={toggle}
      disableIcon={props.disableIcon}
      disabled={!enabled}
      className={`pp-ui-fullscreen pp-ui-fullscreen-${isFullscreen ? 'enabled' : 'disabled'} ${props.className || ''}`}
      style={props.style}  
    >
      {props.children}
    </BaseButton>
  )
}
