import React, { memo } from 'react'

import { Track } from '../Track'
import { TrackLabeler } from '../TrackLabeler'
import { BasePlayerComponentProps, classNames } from '../utils'

import { BaseButton } from './BaseButton'
import { TrackLabel } from './TrackLabel'

export interface TrackSelectionButtonProps extends BasePlayerComponentProps {
  track: Track
  trackLabel?: TrackLabeler
}

export const TrackSelectionButton = memo((props: TrackSelectionButtonProps) => {
  const selectTrack = () => {
    props.player.selectTrack(props.track)
  }

  const label = () => {
    return props.player.getTrackLabel(props.track, props.trackLabel)
  }

  return (
    <BaseButton style={props.style}
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

export default TrackSelectionButton
