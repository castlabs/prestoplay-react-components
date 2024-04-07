import { clpp } from '@castlabs/prestoplay'
import useResizeObserver from '@react-hook/resize-observer'
import { useContext, useDebugValue, useEffect, useLayoutEffect, useState } from 'react'

import { PrestoContext } from './context/PrestoContext'
import { EventListener, EventType } from './EventEmitter'
import { Player, State, UIEvents } from './Player'

type ClppEventHandler = (event: Record<string, any>, presto: clpp.Player) => void

/**
 * This is a React hook that can be used to listen to presto play events.
 *
 * Since this exposes low level PRESTOplay events, try to avoid this and see if you can use
 * the dedicated UI events instead using {@link #usePrestoUiEvent}. This is
 * usually more efficient.
 *
 * @param eventName PRESTOplay event name
 * @param handler The handler function.
 * @param dependencies List of dependencies similar to dependencies of useEffect,
 *  if dependencies change, `handler` will be re-registered.
 * @param presto_ in case this hook is not used in context of `PlayerSurface`
 *  for some reason, presto_ must be passed explicitly
 */
export function usePrestoCoreEvent(
  eventName: string, handler: ClppEventHandler, dependencies: unknown[] = [], presto_?: clpp.Player,
) {
  const presto = useContext(PrestoContext).presto ?? presto_

  useEffect(() => {
    if (!presto) {return}

    const handleEvent = (event: Record<string, any>) => {
      handler(event, presto)
    }

    presto.on(eventName, handleEvent)
    return () => {
      presto.off(eventName, handleEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presto, eventName, ...dependencies])
}

/**
 * Helper hook to listen to UI related events from the player
 *
 * @param eventName The event name
 * @param handler The handler function.
 * @param dependencies List of dependencies similar to dependencies of useEffect,
 *  if dependencies change, `handler` will be re-registered.
 * @param player_ in case this hook is not used in context of `PlayerSurface`
 *  for some reason, player_ must be passed explicitly
 * 
 * @example
 *  // Simple usage:
 *  usePrestoUiEvent('position', (position) => {
 *     setTime(position)
 *   }, [offset])
 * 
 *  // Do not forget to pass any captured variables into the dependencies array:
 *  const [offset, setOffset] = useState(0)
 * 
 *  usePrestoUiEvent('position', (position) => {
 *     setTime(position + offset)
 *   }, [offset])
 */
export function usePrestoUiEvent<E extends EventType<UIEvents>>(
  eventName: E, handler: EventListener<UIEvents[E]>, dependencies?: unknown[], player_?: Player,
) {
  const player = useContext(PrestoContext).player ?? player_
  dependencies = dependencies || []

  useEffect(() => {
    player?.onUIEvent(eventName, handler)
    return () => {
      player?.offUIEvent(eventName, handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, ...dependencies])
}

/**
 * Helper to track enabled state of the player.
 * 
 * @param player_ in case this hook is not used in context of `PlayerSurface`
 *  for some reason, player_ must be passed explicitly
 */
export function usePrestoEnabledState(player_?: Player): boolean {
  const player = useContext(PrestoContext).player ?? player_
  const [enabled, setEnabled] = useState(player.enabled)

  usePrestoUiEvent('enabled', (event) => {
    setEnabled(event)
  })

  return enabled
}

/**
 * Helper to track enabled state of the player and return the state
 * as the appropriate CSS class.
 * 
 * @param player_ in case this hook is not used in context of `PlayerSurface`
 *  for some reason, player_ must be passed explicitly
 */
export function usePrestoEnabledStateClass(player_?: Player): string {
  const enabled = usePrestoEnabledState(player_)
  return enabled ? 'pp-ui-enabled' : 'pp-ui-disabled'
}

/**
 * @returns Size of the player surface, reacts on runtime changes.
 */
export function usePlayerSize() {
  const { playerSurface } = useContext(PrestoContext)
  return useSize(playerSurface)
}

/**
 * @returns True if player controls should be visible
 */
export function useControlsVisible() {
  const { player } = useContext(PrestoContext)
  const [visible, setVisible] = useState(player.controlsVisible)

  usePrestoUiEvent('controlsVisible', setVisible)

  return visible
}

/**
 * @returns video duration in seconds or 0 if not video is loaded
 */
export const useDuration = () => {
  const { player } = useContext(PrestoContext)
  const [duration, setDuration] = useState(player.duration)

  usePrestoUiEvent('durationchange', setDuration)

  return duration
}

/**
 * @param target HTML element
 * @returns element's size, changes on resize
 */
export const useSize = (target: HTMLElement) => {
  const [size, setSize] = useState<{ width: number; height: number }>(target.getBoundingClientRect())

  useLayoutEffect(() => {
    setSize(target.getBoundingClientRect())
  }, [target])

  useResizeObserver(target, (entry) => setSize(entry.contentRect))

  return size
}



type Config = {
  player: Player
  state: State
  resetRate: boolean
  reason?: clpp.events.BufferingReasons
}

function isPlayingState(config: Config): boolean {
  const { player, state, resetRate, reason } = config

  if (state === State.Buffering && reason === clpp.events.BufferingReasons.SEEKING) {
    return player.playing
  }

  if (state !== State.Playing) {
    return false
  }

  if (resetRate && player.rate !== 1) {
    return false
  }

  return true
}

/**
 * @returns whether player state is paused or playing
 */
export const useIsPlaying = (resetRate = false): boolean => {
  const { player } = useContext(PrestoContext)
  const [isPlaying, setIsPlaying] = useState(isPlayingState({ state: player.state, player, resetRate }))

  usePrestoUiEvent('ratechange', () => {
    setIsPlaying(isPlayingState({ state: player.state, player, resetRate }))
  })

  usePrestoUiEvent('statechanged', ({ currentState, reason }) => {
    setIsPlaying(isPlayingState({ state: currentState, player, resetRate, reason }))
  })

  useDebugValue(isPlaying ? 'playing' : 'not playing')

  return isPlaying
}
