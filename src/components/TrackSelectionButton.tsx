import React from "react";
import {Track} from "../Track";
import {BasePlayerComponentProps, classNames} from "../utils";
import TrackLabel from "./TrackLabel";
import BaseButton from "./BaseButton";
import {TrackLabeler} from "../Player";

export interface TrackSelectionButtonProps extends BasePlayerComponentProps {
  track: Track
  trackLabel?: TrackLabeler
}

export const TrackSelectionButton = (props: TrackSelectionButtonProps) => {

  const selectTrack = async () => {
    await props.player.selectTrack(props.track)
  }

  const label = () => {
    return props.player.getTrackLabel(props.track, props.trackLabel)
  }

  return (
    <BaseButton style={props.style}
                className={classNames({
                  "pp-ui": true,
                  "pp-ui-track-selection-button": true
                }, props.className)}
                onClick={selectTrack}
                disableIcon={true}>
      <TrackLabel label={label()} selected={props.track.selected}/>
    </BaseButton>
  )
}
export default TrackSelectionButton
