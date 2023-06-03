import React, { memo, useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { Track } from '../Track'
import { TrackLabeler } from '../TrackLabeler'
import { BaseComponentProps, classNames } from '../utils'

import { BaseButton } from './BaseButton'
import { TrackLabel } from './TrackLabel'

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

  return (
    <BaseButton
      testId="pp-ui-track-selection-button"
      style={props.style}
      className={classNames({
        'pp-ui': true,
        'pp-ui-track-selection-button': true,
      }, props.className)}
      onClick={selectTrack}
      disableIcon={true}>
      <TrackLabel label={label()} selected={props.track.selected}/>
    </BaseButton>
  )
})

TrackSelectionButton.displayName = 'TrackSelectionButton'
