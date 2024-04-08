import { useContext, useEffect, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { EventListener, EventType } from '../EventEmitter'

import { PlayerHlsi, UIEventHlsi } from './PlayerHlsi'
import { HlsInterstitial } from './types'

/**
 * Helper hook to listen to UI related events from the player
 */
export function usePrestoUiEventHlsi<E extends EventType<UIEventHlsi>>(
  eventName: E, handler: EventListener<UIEventHlsi[E]>, dependencies?: unknown[],
) {
  const player = useContext(PrestoContext).player as PlayerHlsi
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
 * @returns Metadata about the currently playing HLS interstitial.
 */
export const useHlsInterstitial = () => {
  const [interstitial, setInterstitial] = useState<HlsInterstitial|null>(null)
  usePrestoUiEventHlsi('hlsInterstitial', setInterstitial)
  return interstitial
}
