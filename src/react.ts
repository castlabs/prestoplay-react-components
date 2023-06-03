import { clpp } from '@castlabs/prestoplay'
import { useContext, useEffect, useState } from 'react'

import { PrestoContext } from './context/PrestoContext'
import { EventListener, EventType } from './EventEmitter'
import { Player, UIEvents } from './Player'

export type ClppEventHandler = (e: clpp.Event, presto: clpp.Player) => void

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
    const handleEvent = (event: clpp.Event) => {
      handler(event, presto)
    }

    presto.on(eventName, handleEvent)
    return () => {
      presto.off(eventName, handleEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, ...dependencies])
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
    player.onUIEvent(eventName, handler)
    return () => {
      player.offUIEvent(eventName, handler)
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
