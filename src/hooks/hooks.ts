import { useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoUiEvent } from '../react'
import { Ad, Cue } from '../types'

/**
 * @returns The current hover position as a percentage
 *   or null when not hovering.
 */
export const useHoverPercent = () => {
  const [percent, setPercent] = useState<number|null>(null)

  usePrestoUiEvent('hoverPosition', (event) => {
    setPercent(event?.percent ?? null)
  }, [])

  return percent
}

/**
 * @returns Timeline / seekBar cues
 */
export const useCues = (): Cue[] => {
  const { player } = useContext(PrestoContext)
  const [cues, setCues] = useState<Cue[]>(player.getCues())
  usePrestoUiEvent('cuesChanged', setCues)
  return cues
}

export const useAd = (): Ad | null => {
  const [ad, setAd] = useState<Ad|null>(null)
  usePrestoUiEvent('adChanged', setAd)
  return ad
}

export const useAdCountdown = (): number | null => {
  const { player } = useContext(PrestoContext)
  const [time, setTime] = useState<number|null>(player.ad?.remainingSec ?? null)
  usePrestoUiEvent('adChanged', ad => setTime(ad?.remainingSec ?? null))
  return time
}
