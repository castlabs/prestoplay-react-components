import React, {useState} from "react";
import {BasePlayerComponentProps, classNames} from "../utils";
import {TrackType} from "../Track";
import TrackSelectionButton from "./TrackSelectionButton";
import {usePrestoUiEvent} from "../react";

export interface TrackSelectionListProps extends BasePlayerComponentProps {
  type: TrackType
}

export const TrackSelectionList = (props: TrackSelectionListProps) => {
  let [tracks, setTracks] = useState(props.player[`${props.type}Tracks`]);

  usePrestoUiEvent(`${props.type}TracksAvailable`, props.player, (tracks) => {
    setTracks(tracks)
  })

  usePrestoUiEvent(`${props.type}TrackChanged`, props.player, (track) => {
    setTracks(props.player[`${props.type}Tracks`])
  })

  let renderSelectionButtons = () => tracks.map(t => {
    return <TrackSelectionButton track={t} player={props.player} key={`${t.type}-${t.id}`}/>
  })

  return (
    <div style={props.style} className={classNames({
      "pp-ui": true,
      "pp-ui-track-selection-list": true,
    }, props.className)}>
      {renderSelectionButtons()}
    </div>
  )
}

export default TrackSelectionList
