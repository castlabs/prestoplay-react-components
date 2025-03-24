import React, { useEffect, useState } from 'react'

import { DefaultTrackLabelerOptions, BaseThemeOverlay, PlayerSurface } from '../../src'

import { PageProps } from './types'

/**
 * A player skin that we ship as `BaseThemeOverlay` component.
 */
export const BasicOverlayPage = (props: PageProps) => {
  const asset = props.asset
  const [playerConfig, setPlayerConfig] = useState(asset?.config)
  const player = props.player

  useEffect(() => {
    if (props.asset?.config) {
      setPlayerConfig({ ...props.asset.config })
    } else {
      setPlayerConfig(undefined)
    }
  }, [props.asset])

  // set options for the default track labeler
  player.trackLabelerOptions = {
    usePlayingRenditionInAbrLabel: true,
    useNativeLanguageNames: false,
    abrLabel: 'Auto',
    disabledTrackLabel: 'Off',
    unknownTrackLabel: 'Unknown',
  } as DefaultTrackLabelerOptions

  return (
    <PlayerSurface
      player={player}
      baseConfig={{}}
      config={playerConfig}
      autoload={true}
      playsInline={true}
      style={{ resize: 'both', overflow: 'auto', width: 900, height: 340 }}
    >
      <BaseThemeOverlay version={2}/>
    </PlayerSurface>
  )
}
