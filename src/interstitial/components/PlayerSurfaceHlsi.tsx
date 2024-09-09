import { clpp } from '@castlabs/prestoplay'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { BaseComponentProps } from '../../components/types'
import { PrestoContext, PrestoContextType } from '../../context/PrestoContext'
import { PlayerHlsi } from '../PlayerHlsi'

export interface PlayerProps extends BaseComponentProps {
  /**
   * The player instance
   */
  player: PlayerHlsi
  children?: React.ReactNode
  /**
   * Options of HLS Interstitial Player
   */
  interstitialOptions?: Omit<clpp.interstitial.Options, 'anchorEl'>
}

const getContext = (nullableContext: Partial<PrestoContextType>) => {
  if (!nullableContext.playerSurface || !nullableContext.player) {
    return null
  }

  return nullableContext as PrestoContextType
}

/**
 * Player Surface for HLS Interstitial Player
 */
export const PlayerSurfaceHlsi = (props: PlayerProps) => {
  const [nullableContext, setPrestoContext ] = useState<Partial<PrestoContextType>>({
    playerSurface: undefined,
    player: props.player,
    presto: undefined,
  })
  const containerRef = useRef<HTMLDivElement|null>(null)

  const onAnchorRef = useCallback((anchor: HTMLDivElement) => {
    if (!anchor) {return}
    const options = (props.interstitialOptions ?? { config: {} })
    const config = options.config ?? {}
    props.player.initHlsi({ ...options, config, anchorEl: anchor })
  }, [])

  useEffect(() => {
    const setPresto = (player: clpp.Player) => {
      setPrestoContext(context => ({
        ...context,
        presto: player,
      }))
    }
    props.player.onUIEvent('playerChanged', setPresto)

    return () => {
      props.player.offUIEvent('playerChanged', setPresto)
      props.player.release()
        .catch(err => console.error('Failed to release the player', err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mouseMove = () => {
    if (!props.player.controlsVisible && !props.player.slideInMenuVisible) {
      props.player.surfaceInteraction()
    }
  }

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

  const handleContainerRef = (element: HTMLDivElement|null) => {
    containerRef.current = element

    if (element && !nullableContext.playerSurface) {
      setPrestoContext(context => ({
        ...context,
        playerSurface: element,
      }))
    }
  }

  const context = getContext(nullableContext)

  return (
    <div ref={handleContainerRef}
      data-testid="pp-ui-surface"
      className={`pp-ui pp-ui-surface ${props.className || ''}`}
      style={props.style}
      onClick={mouseClick}
      onMouseMove={mouseMove}
      tabIndex={0}
    >
      <div
        className='pp-ui-hlsi-video-anchor'
        ref={onAnchorRef}
        tabIndex={-1}
      ></div>
      {context &&
        <PrestoContext.Provider value={context}>
          <div className={'pp-ui pp-ui-overlay'}>
            {props.children}
          </div>
        </PrestoContext.Provider>
      }
    </div>
  )
}
