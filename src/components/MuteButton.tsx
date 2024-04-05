import React, { useContext, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoCoreEvent, usePrestoEnabledState } from '../react'

import { BaseButton } from './BaseButton'

import type { BasePlayerComponentButtonProps } from './types'


export interface MuteButtonProps extends BasePlayerComponentButtonProps {
  children?: React.ReactNode
  /**
   * Whether audio is muted or not.
   * 
   * By default you should leave this `undefined` and let the component
   * display the real mute state of the player.
   */
  muted?: boolean
}

/**
 * Mute button.
 * A button that mutes/un-mutes audio.
 */
export const MuteButton = (props: MuteButtonProps) => {
  const { player } = useContext(PrestoContext)
  const [muted, setMuted] = useState(false)
  const enabled = usePrestoEnabledState()

  usePrestoCoreEvent('volumechange', (e, presto) => {
    setMuted(presto.isMuted() ?? false)
  })
  usePrestoCoreEvent('loadedmetadata', (e, presto) => {
    setMuted(presto.isMuted() ?? false)
  })

  async function toggle(e: React.MouseEvent) {
    if (e.defaultPrevented) {return}
    const presto = await player.presto()
    presto.setMuted(!presto.isMuted())
  }

  return (
    <BaseButton
      testId="pp-ui-mute-button"
      onClick={toggle} disableIcon={props.disableIcon} disabled={!enabled}
      className={`pp-ui-mute-toggle pp-ui-mute-toggle-${(props.muted ?? muted) ? 'unmuted' : 'muted'} ${props.className || ''}`}
      style={props.style}
    >
      {props.children}
    </BaseButton>
  )
}
