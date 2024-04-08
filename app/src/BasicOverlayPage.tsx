import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import React, { useMemo } from 'react'

import { DefaultTrackLabelerOptions, Player, BaseThemeOverlay, PlayerSurface } from '../../src'

import { Asset } from './Asset'


/**
 * A player skin that we ship as `BaseThemeOverlay` component.
 */
export const BasicOverlayPage = (props: {
  asset?: Asset
  autoload?: boolean
}) => {
  const asset = props.asset
  const playerConfig = asset?.config

  const player = useMemo(() => {
    return new Player(pp => {
      pp.use(clpp.dash.DashComponent)
      pp.use(clpp.hls.HlsComponent)
      pp.use(clpp.htmlcue.HtmlCueComponent)
      pp.use(clpp.ttml.TtmlComponent)
      pp.use(clpp.vtt.VttComponent)
    })
  }, [])

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
      <BaseThemeOverlay/>
    </PlayerSurface>
  )
}
