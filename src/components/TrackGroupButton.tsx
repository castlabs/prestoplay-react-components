import React, { MouseEventHandler, useState } from 'react'

import { usePrestoEnabledState, usePrestoUiEvent } from '../react'
import { TrackType } from '../Track'
import {
  DefaultTrackLabelerOptions,
  TrackLabeler,
} from '../TrackLabeler'
import { BasePlayerComponentProps, classNames } from '../utils'

import { BaseButton } from './BaseButton'
import { Label } from './Label'


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
  const [activeTrack, setActiveTrack] = useState(props.player.activeTrack(props.type))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPlayingVideoTrack] = useState(props.player.playingVideoTrack)
  const enabled = usePrestoEnabledState(props.player)

  usePrestoUiEvent(`${props.type}TrackChanged`, props.player, (track) => {
    setActiveTrack(track)
  })

  usePrestoUiEvent('playingVideoTrackChanged', props.player, (track) => {
    setPlayingVideoTrack(track)
  })

  const hasTracks = () => {
    switch (props.type) {
      case 'video':
        return props.player.videoTracks.length > 0
      case 'audio':
        return props.player.audioTracks.length > 0
      case 'text':
        return props.player.textTracks.length > 0
    }
  }

  const renderActiveTrackLabel = () => {
    if (props.hideCurrentlyActive || !activeTrack) {return}
    return <Label
      className={'pp-ui-label-subtitle'}
      label={props.player.getTrackLabel(activeTrack, props.trackLabel, {
        usePlayingRenditionInAbrLabel: props.usePlayingRenditionInAbrLabel == null ? true : props.usePlayingRenditionInAbrLabel,
      } as DefaultTrackLabelerOptions)}/>
  }

  return (
    <BaseButton disableIcon={true}
      style={props.style}
      onClick={props.onClick}
      disabled={!enabled}
      className={classNames({
        'pp-ui': true,
        'pp-ui-track-group-button': true,
        'pp-ui-hide': !!props.hideWhenUnavailable && !hasTracks(),
      }, props.className)}>
      <Label label={props.label} className={'pp-ui-label-title'}/>
      {renderActiveTrackLabel()}
    </BaseButton>
  )
}

export default TrackGroupButton
