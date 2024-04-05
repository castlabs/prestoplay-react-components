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

// @ts-ignore
window.clpp = clpp

// @ts-ignore
clpp.install(clpp.dash.DashComponent)
// @ts-ignore
clpp.install(clpp.hls.HlsComponent)
// @ts-ignore
clpp.install(clpp.htmlcue.HtmlCueComponent)
// @ts-ignore
clpp.install(clpp.ttml.TtmlComponent)
// @ts-ignore
clpp.install(clpp.vtt.VttComponent)



/**
 * A player skin that we ship as `BaseThemeOverlay` component.
 */
export const InterstitialPage = (props: {
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

  const play = async () => {
    if (asset) {
      try {
        await player.load({
          source: {
            url: 'http://localhost:3000/vod-fixed.m3u8',
            type: clpp.Type.HLS,
          },
        })
      } catch (e) {
        console.error('Failed to load', e)
      }
    }
  }

  // TODO this player surface
  return (
    <main className="in-page">
      <div className="in-container">
        <div className="in-video-container">
          <PlayerSurface
            player={player}
            config={playerConfig}
            autoload={props.autoload}
            playsInline={true}
          >
            <BaseThemeOverlay
              startButton={false}
              // posterUrl={showPoster ? asset?.poster: ''}
              seekForward={10}
              seekBackward={-10}
              menuSelectionOptions={[
                { type: 'audio', label: 'Language', hideCurrentlyActive:false, hideWhenUnavailable: true },
                { type: 'text', label: 'Subtitles', hideCurrentlyActive:false, hideWhenUnavailable: true },
                { type: 'video', label: 'Video', hideCurrentlyActive:false, hideWhenUnavailable: true },
              ]}
            />
          </PlayerSurface>
        </div>
        <div className={'options'}>
          <button onClick={play}>Play</button>
          {/* <label>
            <input type={'checkbox'} checked={showStartButton} onChange={() => {setShowStartButton(!showStartButton)}}/>
          Show Start Button
          </label>
          <label>
            <input type={'checkbox'} checked={showPoster} onChange={() => {setShowPoster(!showPoster)}}/>
          Show Poster
          </label> */}

        </div>
      </div>
    </main>
  )
}
