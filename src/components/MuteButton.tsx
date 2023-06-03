import React, { useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoCoreEvent, usePrestoEnabledState } from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from '../utils'


export interface MuteButtonProps extends BasePlayerComponentButtonProps {
  children?: React.ReactNode
}

/**
 * Mute button.
 * A button that mutes/un-mutes audio.
 */
export const MuteButton = (props: MuteButtonProps) => {
  const { presto } = useContext(PrestoContext)
  const [muted, setMuted] = useState(false)
  const enabled = usePrestoEnabledState()

  usePrestoCoreEvent('volumechange', (e, presto) => {
    setMuted(presto.isMuted())
  })
  usePrestoCoreEvent('loadedmetadata', (e, presto) => {
    setMuted(presto.isMuted())
  })

  function toggle(e: React.MouseEvent) {
    if (e.defaultPrevented) {return}
    presto.setMuted(!presto.isMuted())
  }

  return (
    <BaseButton
      testId="pp-ui-mute-button"
      onClick={toggle} disableIcon={props.disableIcon} disabled={!enabled}
      className={`pp-ui-mute-toggle pp-ui-mute-toggle-${muted? 'unmuted' : 'muted'} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
}
