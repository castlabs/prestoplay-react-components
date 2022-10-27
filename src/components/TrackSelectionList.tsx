import React, {useState} from "react";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentProps, classNames} from "../utils";
import {TrackType} from "../Track";
import {usePrestoUiEvent} from "../Player";
import {TrackSelectionButton} from "./TrackSelectionButton";

export interface TrackSelectionListProps extends BasePlayerComponentProps {
  type: TrackType
}

const TrackSelectionList = (props: TrackSelectionListProps) => {
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
