import React, { UIEventHandler, useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoEnabledState, usePrestoUiEvent } from '../react'
import { TrackType } from '../Track'
import {
  DefaultTrackLabelerOptions,
  TrackLabeler,
} from '../TrackLabeler'
import { classNames } from '../utils'


import { BaseButton } from './BaseButton'
import { Label } from './Label'

import type { BaseComponentProps } from './types'


export interface TrackGroupButtonProps extends BaseComponentProps {
  type: TrackType
  label: string
  hideCurrentlyActive?: boolean
  hideWhenUnavailable?: boolean
  trackLabel?: TrackLabeler
  onClick?: UIEventHandler | undefined
  usePlayingRenditionInAbrLabel?: boolean
}

/**
 * Track group button.
 */
export const TrackGroupButton = (props: TrackGroupButtonProps) => {
  const { player } = useContext(PrestoContext)
  const [activeTrack, setActiveTrack] = useState(player.activeTrack(props.type))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPlayingVideoTrack] = useState(player.playingVideoTrack)
  const enabled = usePrestoEnabledState()

  usePrestoUiEvent(`${props.type}TrackChanged`, (track) => {
    setActiveTrack(track)
  })

  usePrestoUiEvent('playingVideoTrackChanged', (track) => {
    setPlayingVideoTrack(track)
  })

  const hasTracks = () => {
    switch (props.type) {
      case 'video':
        return player.videoTracks.length > 0
      case 'audio':
        return player.audioTracks.length > 0
      case 'text':
        return player.textTracks.length > 0
    }
  }

  const renderActiveTrackLabel = () => {
    if (props.hideCurrentlyActive || !activeTrack) {return}
    return <Label
      className={'pp-ui-label-subtitle'}
      label={player.getTrackLabel(activeTrack, props.trackLabel, {
        usePlayingRenditionInAbrLabel: props.usePlayingRenditionInAbrLabel == null ? true : props.usePlayingRenditionInAbrLabel,
      } as DefaultTrackLabelerOptions)}/>
  }

  const className = classNames({
    'pp-ui': true,
    'pp-ui-track-group-button': true,
    'pp-ui-hide': !!props.hideWhenUnavailable && !hasTracks(),
  }, props.className)

  return (
    <BaseButton
      testId="pp-ui-track-group-button"
      disableIcon={true}
      style={props.style}
      onClick={props.onClick}
      disabled={!enabled}
      className={className}>
      <Label label={props.label} className={'pp-ui-label-title'}/>
      {renderActiveTrackLabel()}
    </BaseButton>
  )
}
