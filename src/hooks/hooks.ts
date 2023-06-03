import { useState } from 'react'

import { usePrestoUiEvent } from '../react'

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
