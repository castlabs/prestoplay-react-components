import React, { useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { Player } from '../Player'
import { usePrestoUiEvent } from '../react'
import { TrackType } from '../Track'
import { BaseComponentProps, classNames } from '../utils'

import { TrackSelectionButton } from './TrackSelectionButton'


export interface TrackSelectionListProps extends BaseComponentProps {
  type: TrackType
}

const useTracks = (player: Player, type: TrackType) => {
  const [tracks, setTracks] = useState(player[`${type}Tracks`])

  usePrestoUiEvent(`${type}TracksAvailable`, (tracks) => {
    setTracks(tracks)
  })

  usePrestoUiEvent(`${type}TrackChanged`, () => {
    setTracks(player[`${type}Tracks`])
  })

  return tracks
}

/**
 * Track selection list.
 * A list which presents all available tracks (audio/video/sub) and allows switching between them.
 */
export const TrackSelectionList = (props: TrackSelectionListProps) => {
  const { player } = useContext(PrestoContext)
  const tracks = useTracks(player, props.type)

  return (
    <div
      data-testid="pp-ui-track-selection-list"
      style={props.style}
      className={classNames({
        'pp-ui': true,
        'pp-ui-track-selection-list': true,
      }, props.className)}>
      {tracks.map(t => {
        return <TrackSelectionButton key={`${t.type}-${t.id}`} track={t}/>
      })}
    </div>
  )
}
