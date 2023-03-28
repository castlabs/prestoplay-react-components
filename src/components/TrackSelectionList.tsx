import React, { useState } from 'react'

import Player from '../Player'
import { usePrestoUiEvent } from '../react'
import { TrackType } from '../Track'
import { BasePlayerComponentProps, classNames } from '../utils'

import TrackSelectionButton from './TrackSelectionButton'


export interface TrackSelectionListProps extends BasePlayerComponentProps {
  type: TrackType
}

const useTracks = (player: Player, type: TrackType) => {
  const [tracks, setTracks] = useState(player[`${type}Tracks`])

  usePrestoUiEvent(`${type}TracksAvailable`, player, (tracks) => {
    setTracks(tracks)
  })

  usePrestoUiEvent(`${type}TrackChanged`, player, () => {
    setTracks(player[`${type}Tracks`])
  })

  return tracks
}

export const TrackSelectionList = (props: TrackSelectionListProps) => {
  const tracks = useTracks(props.player, props.type)

  return (
    <div style={props.style} className={classNames({
      'pp-ui': true,
      'pp-ui-track-selection-list': true,
    }, props.className)}>
      {tracks.map(t => {
        return <TrackSelectionButton key={`${t.type}-${t.id}`} track={t} player={props.player}/>
      })}
    </div>
  )
}

export default TrackSelectionList
