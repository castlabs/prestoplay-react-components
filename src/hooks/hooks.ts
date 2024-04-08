import { useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoUiEvent } from '../react'
import { Cue } from '../types'

/**
 * @returns The current hover position as a percentage
 *   or null when not hovering.
 */
export const useHoverPercent = () => {
  const [percent, setPercent] = useState<number>(-1)

  usePrestoUiEvent('hoverPosition', (event) => {
    setPercent(event.percent)
  }, [])

  return percent < 0 ? null : percent
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
