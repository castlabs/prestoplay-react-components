import { clpp } from '@castlabs/prestoplay'
import React, { useEffect, useState } from 'react'

import { EventListener, EventType } from './EventEmitter'
import { Player, UIEvents } from './Player'

export type ClppEventHandler = (e: any, presto: any) => void

/**
 * This is a React hook that can be used to listen to presto play events.
 * pass a valid Presto event name, the player instance and a handler and the
 * hook will register (and de-register) a listener when the player instance is
 * available.
 *
 * While this exposes low level events, try to avoid this and see if you can use
 * the dedicated UI events instead using {@link #usePrestoUiEvent}. This is
 * usually more efficient.
 *
 * @param eventName The event name
 * @param player The player
 * @param handler The handler function
 * @param dependencies Optional list of additional dependencies
 */
export function usePrestoCoreEvent(eventName: string, player: Player, handler: ClppEventHandler, dependencies?: any[]) {
  async function handleEvent(e: any) {
    const presto = await player.presto()
    handler(e, presto)
  }

  dependencies = dependencies || []

  // the hook is "active" until the effect is reversed. We
  // store this here to make sure we do not add listeners
  // if the player becomes available "too late" since the core player
  // instance is resolved async.
  let active = true
  // The presto instance. Once we have it, we assume the listener was
  // added and needs to be removed again
  let presto: clpp.Player | null = null

  useEffect(() => {
    player.presto().then(pp => {
      if (active) {
        presto = pp
        pp.on(eventName, handleEvent)
      }
    })
    return () => {
      active = false
      if (presto) {
        presto.off(eventName, handleEvent)
      }
    }
  }, [player, ...dependencies])
}

/**
 * Helper hook to listen to UI related events from the player
 *
 * @param eventName The event name
 * @param player The player
 * @param handler The handler function
 * @param dependencies List of optional additional dependencies
 */
export function usePrestoUiEvent<E extends EventType<UIEvents>>(eventName: E, player: Player, handler: EventListener<UIEvents[E]>, dependencies?: any[]) {
  dependencies = dependencies || []
  useEffect(() => {
    player.onUIEvent(eventName, handler)
    return () => {
      player.offUIEvent(eventName, handler)
    }
  }, [player, ...dependencies])
}

/**
 * Helper hook that provides access to the presto play instance once it becomes
 * available.
 *
 * @param player The player instance
 * @param receiver The receiver is a function that takes the presto instance as
 *   the first argument
 */
export function usePresto(player: Player, receiver: (presto: any) => void) {
  useEffect(() => {
    let completed = false
    player.presto().then((presto) => {
      if (!completed) {
        receiver(presto)
      }
    })
    return () => {
      completed = true
    }
  }, [player])
}

/**
 * Helper hook that takes a random element and calls the passed hide function
 * if a mouse click is registered anywhere outside the provided element.
 *
 * @param ref The ref to the element
 * @param hide The hide function that will be called if a click is registered
 *   outside
 */
export function useGlobalHide(ref: React.RefObject<Element>, hide: () => any) {
  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      if (ref.current && !ref.current.contains((event.target as Node))) {
        await hide()
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

/**
 * Helper to track enabled state of the player. The returned boolean represents
 * the enabled state of the player
 *
 * @param player
 */
export function usePrestoEnabledState(player: Player): boolean {
  const [enabled, setEnabled] = useState(player.enabled)
  usePrestoUiEvent('enabled', player, (e) => {
    setEnabled(e)
  })
  return enabled
}

/**
 * Helper to track enabled state of the player and return the state as the
 * appropriate css class
 *
 * @param player
 */
export function usePrestoEnabledStateClass(player: Player): string {
  const [enabled, setEnabled] = useState(player.enabled)
  usePrestoUiEvent('enabled', player, (e) => {
    setEnabled(e)
  })
  return enabled ? 'pp-ui-enabled' : 'pp-ui-disabled'
}
