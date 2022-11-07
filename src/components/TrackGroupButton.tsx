import React, {MouseEventHandler, useState} from "react";
import {TrackType} from "../Track";
import {BasePlayerComponentProps, classNames} from "../utils";
import {
  DefaultTrackLabelerOptions,
  TrackLabeler
} from "../Player";
import BaseButton from "./BaseButton";
import Label from "./Label";
import {usePrestoEnabledState, usePrestoUiEvent} from "../react";

export interface TrackGroupButtonProps extends BasePlayerComponentProps {
  type: TrackType
  label: string
  hideCurrentlyActive?: boolean
  hideWhenUnavailable?: boolean
  trackLabel?: TrackLabeler
  onClick?: MouseEventHandler | undefined
  usePlayingRenditionInAbrLabel?: boolean
}

export const TrackGroupButton = (props: TrackGroupButtonProps) => {
  let [activeTrack, setActiveTrack] = useState(props.player.activeTrack(props.type));
  let [_, setPlayingVideoTrack] = useState(props.player.playingVideoTrack);
  let enabled = usePrestoEnabledState(props.player);

  usePrestoUiEvent(`${props.type}TrackChanged`, props.player, (track) => {
    setActiveTrack(track)
  })

  usePrestoUiEvent("playingVideoTrackChanged", props.player, (track) => {
    setPlayingVideoTrack(track)
  })

  const hasTracks = () => {
    switch (props.type) {
      case "video":
        return props.player.videoTracks.length > 0
      case "audio":
        return props.player.audioTracks.length > 0
      case "text":
        return props.player.textTracks.length > 0
    }
  }

  let renderActiveTrackLabel = () => {
    if (props.hideCurrentlyActive || !activeTrack) return
    return <Label
      className={"pp-ui-label-subtitle"}
      label={props.player.getTrackLabel(activeTrack, props.trackLabel, {
        usePlayingRenditionInAbrLabel: props.usePlayingRenditionInAbrLabel == undefined ? true : props.usePlayingRenditionInAbrLabel
      } as DefaultTrackLabelerOptions)}/>
  }

  return (
    <BaseButton disableIcon={true}
                style={props.style}
                onClick={props.onClick}
                disabled={!enabled}
                className={classNames({
                  "pp-ui": true,
                  "pp-ui-track-group-button": true,
                  "pp-ui-hide": !!props.hideWhenUnavailable && !hasTracks(),
                }, props.className)}>
      <Label label={props.label} className={"pp-ui-label-title"}/>
      {renderActiveTrackLabel()}
    </BaseButton>
  )
}

export default TrackGroupButton
