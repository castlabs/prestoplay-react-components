import React from 'react'

import { useIsPlaying } from '../react'

type Props = {
  className?: string
  /**
   * Specify this to override playing state
   */
  isPlaying?: boolean
}

/**
 * Visual indicator of play / pause event.
 */
export const PlayPauseIndicator = (props: Props) => {
  const isPlaying = useIsPlaying()

  const className = `pp-ui-playpause-indicator pp-ui-playpause-toggle pp-ui-state-${props.isPlaying ?? isPlaying ? 'pause' : 'play'}`
    +` pp-ui-circle-bg ${props.className || ''}`

  return (
    <div className="pp-ui-centered" data-testid="pp-ui-playpause-indicator">
      <div className={className}>
        <div className="pp-ui pp-ui-icon-white pp-ui-centered">
          <i className="pp-ui pp-ui-icon" />
        </div>
      </div>
    </div>
  )
}
