import React, { memo, useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { Track } from '../Track'
import { TrackLabeler } from '../TrackLabeler'
import { classNames } from '../utils'

import { BaseButton } from './BaseButton'
import { TrackLabel } from './TrackLabel'

import type { BaseComponentProps } from './types'

export interface TrackSelectionButtonProps extends BaseComponentProps {
  track: Track
  trackLabel?: TrackLabeler
}

/**
 * Track selection button.
 */
export const TrackSelectionButton = memo((props: TrackSelectionButtonProps) => {
  const { player } = useContext(PrestoContext)

  const selectTrack = () => {
    player.selectTrack(props.track)
  }

  const label = () => {
    return player.getTrackLabel(props.track, props.trackLabel)
  }

  const className = classNames({
    'pp-ui': true,
    'pp-ui-track-selection-button': true,
  }, props.className)

  return (
    <BaseButton
      testId="pp-ui-track-selection-button"
      style={props.style}
      className={className}
      onClick={selectTrack}
      disableIcon={true}>
      <TrackLabel label={label()} selected={props.track.selected}/>
    </BaseButton>
  )
})

TrackSelectionButton.displayName = 'TrackSelectionButton'
