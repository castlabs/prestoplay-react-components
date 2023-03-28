import React, { useState } from 'react'

import { usePrestoCoreEvent, usePrestoEnabledState } from '../react'
import { BasePlayerComponentButtonProps } from '../utils'

import BaseButton from './BaseButton'

export type MuteButtonProps = BasePlayerComponentButtonProps

export const MuteButton = (props: MuteButtonProps) => {
  const [muted, setMuted] = useState(false)
  const enabled = usePrestoEnabledState(props.player)

  usePrestoCoreEvent('volumechange', props.player, (e, presto) => {
    setMuted(presto.isMuted())
  })
  usePrestoCoreEvent('loadedmetadata', props.player, (e, presto) => {
    setMuted(presto.isMuted())
  })

  async function toggle(e: React.MouseEvent) {
    if(e.defaultPrevented) {return}

    const presto = await props.player.presto()
    presto.setMuted(!presto.isMuted())
  }

  return (
    <BaseButton onClick={toggle} disableIcon={props.disableIcon} disabled={!enabled}
      className={`pp-ui-mute-toggle pp-ui-mute-toggle-${muted? 'unmuted' : 'muted'} ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  )
}

export default MuteButton
