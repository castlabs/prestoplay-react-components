import { clpp } from '@castlabs/prestoplay'
import React, { useEffect, useRef, useState } from 'react'

import { PrestoContext, PrestoContextType } from '../context/PrestoContext'
import { Player } from '../Player'
import { usePrestoUiEvent } from '../react'
import {
  focusElement,
  focusNextElement, focusPreviousElement,
  getFocusableElements, isIpadOS,
} from '../utils'

import type { BaseComponentProps } from './types'

/**
 * The properties of the player surface. This is the element that receives
 * the PRESTOplay configuration.
 */
export interface PlayerProps extends BaseComponentProps {
  /**
   * The player instance
   */
  player: Player
  /**
   * The PRESTOplay player configuration to load and play a video
   * https://demo.castlabs.com/#/docs?q=clpp#PlayerConfiguration
   */
  config?: clpp.PlayerConfiguration
  /**
   * The PRESTOplay player configuration to initialize the player
   * https://demo.castlabs.com/#/docs?q=clpp#PlayerConfiguration
   */
  baseConfig?: clpp.PlayerConfiguration
  /**
   * Indicate that the configuration should be applied immediately. If this is
   * set to false, the config will be passed to the player, but not applied
   * immediately.
   */
  autoload?: boolean
  /**
   * Pass the plays inline flag to the video element. This is relevant for mobile
   * and iPad devices to decide if the playback can start embedded in the page or the
   * player will go to full-screen mode and no overlay will be possible.
   */
  playsInline?: boolean
  children?: React.ReactNode
  /**
   * @private
   */
  onContext?: (context: PrestoContextType) => void
}

const getContext = (nullableContext: Partial<PrestoContextType>) => {
  return Object.values(nullableContext)
    .every(value => value != null) ? nullableContext as PrestoContextType : null
}

/**
 * Stub for storybook
 */
export const PlayerSurfaceForStory = (props: PlayerProps) => {
  return <div style={{ background: 'black', width: 500, height: 300 }}>
    {props.children}
  </div>
}


/**
 * Player Surface.
 * The Player Surface receives the player instance and a configuration
 * and renders the related video element. It also serves as a container
 * and a context provider for the rest of the UI.
 */
export const PlayerSurface = (props: PlayerProps) => {
  const [nullableContext, setPrestoContext ] = useState<Partial<PrestoContextType>>({
    playerSurface: undefined,
    player: props.player,
    presto: undefined,
  })
  const context = getContext(nullableContext)

  useEffect(() => {
    context && props.onContext?.(context)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  const containerRef = useRef<HTMLDivElement|null>(null)

  const createVideo = async (video: HTMLVideoElement|null) => {
    if (!video || context) {return}
    
    await props.player.init(video, props.baseConfig)
    const presto = await props.player.presto()

    setPrestoContext(context => ({
      ...context,
      presto,
    }))
  }

  useEffect(() => {
    return () => {
      props.player.release()
        .catch(err => console.error('Failed to release the player', err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!props.config) {return}

    props.player.load(props.config, props.autoload)
      .catch(err => console.error('Failed to load source', props.config, err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.config, props.player])


  function maybeFocusSurface(forceSurfaceFocus?: boolean) {
    if (containerRef.current) {
      const element: HTMLDivElement = containerRef.current
      const items = getFocusableElements(element)
      const index = items.indexOf(document.activeElement as HTMLElement)
      const surfaceFocused = document.activeElement === element
      if ((index === -1 && !surfaceFocused) || forceSurfaceFocus) {
        focusElement(element)
      }
    }
  }

  usePrestoUiEvent('surfaceInteraction', () => {
    maybeFocusSurface()
  }, [], props.player)

  usePrestoUiEvent('controlsVisible', (visible) => {
    if (!visible && !props.player.slideInMenuVisible) {
      maybeFocusSurface(true)
    }
  }, [], props.player)

  // const mouseMove = () => {
  //   if (!props.player.controlsVisible && !props.player.slideInMenuVisible) {
  //     props.player.surfaceInteraction()
  //   }
  // }

  const mouseClick = (e: React.MouseEvent) => {
    if (!e.defaultPrevented) {
      if (props.player.slideInMenuVisible) {
        props.player.slideInMenuVisible = false
        e.preventDefault()
      } else if (props.player.controlsVisible) {
        props.player.controlsVisible = false
        e.preventDefault()
      } else {
        props.player.surfaceInteraction()
        e.preventDefault()
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.defaultPrevented) {return}

    if (containerRef && containerRef.current) {
      const element: HTMLDivElement = containerRef.current
      const items = getFocusableElements(element)

      if (e.code === 'ArrowDown') {
        focusNextElement(items)
        e.preventDefault()
        props.player.surfaceInteraction()
      } else if (e.code === 'ArrowUp') {
        focusPreviousElement(items)
        e.preventDefault()
        props.player.surfaceInteraction()
      } else if (e.code === 'Escape') {
        if (props.player.slideInMenuVisible) {
          props.player.slideInMenuVisible = false
          props.player.controlsVisible = false
          maybeFocusSurface(true)
          e.preventDefault()
        } else if (props.player.controlsVisible) {
          props.player.controlsVisible = false
          maybeFocusSurface(true)
          e.preventDefault()
        }
      } else if (e.code === 'Enter') {
        if (!props.player.slideInMenuVisible && !props.player.controlsVisible) {
          props.player.surfaceInteraction()
          e.preventDefault()
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
    window.tizen?.mediakey.setMediaKeyEventListener({
      onpressed: function(key: string) {
        console.log('Pressed key: ' + key)
        if (key === 'MEDIA_PLAY') {
          props.player.playing = true
        } else if (key === 'MEDIA_PAUSE') {
          props.player.playing = false
        }
      },
      onreleased: function(key: string) {
        console.log('Released key: ' + key)
      },
    })

    return () => {
      window.tizen?.mediakey.unsetMediaKeyEventListener()
    }
  }, [props.player])

  const handleContainerRef = (element: HTMLDivElement|null) => {
    containerRef.current = element

    if (element && !nullableContext.playerSurface) {
      setPrestoContext(context => ({
        ...context,
        playerSurface: element,
      }))
    }
  }

  return (
    <div ref={handleContainerRef}
      data-testid="pp-ui-surface" 
      className={`pp-ui pp-ui-surface ${isIpadOS() ? 'pp-ui-ipad' : ''} ${props.className || ''}`}
      style={props.style}
      onClick={mouseClick}
      // onMouseMove={mouseMove}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <video className={'pp-ui pp-ui-video'}
        ref={createVideo}
        tabIndex={-1}
        playsInline={props.playsInline}>
      </video>
      {context && 
        <PrestoContext.Provider value={context}>
          <div className={`pp-ui pp-ui-overlay ${isIpadOS() ? 'pp-ui-ipad' : ''}`}>
            {props.children}
          </div>
        </PrestoContext.Provider>
      }
    </div>
  )
}
