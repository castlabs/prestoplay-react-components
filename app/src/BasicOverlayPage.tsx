import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import React, { useState } from 'react'

import { DefaultTrackLabelerOptions, Player, BaseThemeOverlay, PlayerSurface } from '../../src'

import { Asset } from './Asset'


/**
 * A player skin that we ship as `BaseThemeOverlay` component.
 */
export const BasicOverlayPage = (props: {
  asset?: Asset
  autoload?: boolean
}) => {
  const [showStartButton, setShowStartButton] = useState<boolean>(true)
  const [showPoster, setShowPoster] = useState<boolean>(true)

  // Create the player as state of this component
  const [player] = useState(new Player(pp => {
    pp.use(clpp.dash.DashComponent)
    pp.use(clpp.hls.HlsComponent)
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }))

  const asset = props.asset
  const playerConfig = asset?.config

  // set options for the default track labeler
  player.trackLabelerOptions = {
    usePlayingRenditionInAbrLabel: true,
    useNativeLanguageNames: false,
    abrLabel: 'Auto',
    disabledTrackLabel: 'Off',
    unknownTrackLabel: 'Unknown',
  } as DefaultTrackLabelerOptions

  return (
    <>
      <PlayerSurface
        player={player}
        config={playerConfig}
        autoload={props.autoload}
        playsInline={true}
      >
        <BaseThemeOverlay
          startButton={!props.autoload && showStartButton}
          posterUrl={showPoster ? asset?.poster: ''}
          seekForward={10}
          seekBackward={-10}
          menuSelectionOptions={[
            { type: 'audio', label: 'Language', hideCurrentlyActive:false, hideWhenUnavailable: true },
            { type: 'text', label: 'Subtitles', hideCurrentlyActive:false, hideWhenUnavailable: true },
            { type: 'video', label: 'Video', hideCurrentlyActive:false, hideWhenUnavailable: true },
          ]}
        />
      </PlayerSurface>

      <div className={'options'}>
        <label>
          <input type={'checkbox'} checked={showStartButton} onChange={() => {setShowStartButton(!showStartButton)}}/>
          Show Start Button
        </label>
        <label>
          <input type={'checkbox'} checked={showPoster} onChange={() => {setShowPoster(!showPoster)}}/>
          Show Poster
        </label>

      </div>
    </>
  )
}
