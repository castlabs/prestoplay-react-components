import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { Player, usePrestoEnabledState } from '../../src'
import { CurrentTime } from '../../src/components/CurrentTime'
import { Duration } from '../../src/components/Duration'
import { FullscreenButton } from '../../src/components/FullscreenButton'
import { HorizontalBar } from '../../src/components/HorizontalBar'
import { HoverContainer } from '../../src/components/HoverContainer'
import { Label } from '../../src/components/Label'
import { MuteButton } from '../../src/components/MuteButton'
import { PlayerControls } from '../../src/components/PlayerControls'
import { PlayerSurface } from '../../src/components/PlayerSurface'
import { PlayPauseButton } from '../../src/components/PlayPauseButton'
import { SeekBar } from '../../src/components/SeekBar'
import { Spacer } from '../../src/components/Spacer'
import { Thumbnail } from '../../src/components/Thumbnail'
import { VerticalBar } from '../../src/components/VerticalBar'
import { VolumeBar } from '../../src/components/VolumeBar'

import { Asset } from './Asset'


/**
 * A custom player skin assembled from our UI components
 * in the style of YouTube.
 */
export const YoutubeControlsPage = (props: {
  asset?: Asset
  autoload?: boolean
}) => {
  // Create the player as state of this component
  const [player] = useState(new Player((pp: clpp.Player) => {
    pp.use(clpp.dash.DashComponent)
    pp.use(clpp.hls.HlsComponent)
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }))

  const asset = props.asset
  const playerConfig = asset?.config

  return (
    <div>
      <Helmet>
        <link rel="stylesheet" href="youtube.css"/>
      </Helmet>
      <PlayerSurface
        player={player}
        config={playerConfig}
        playsInline={true}
        autoload={props.autoload}
        style={{ height: '320px' }}>
        <Ui player={player} asset={asset} />
      </PlayerSurface>
    </div>
  )
}

type PropsUi = {
  player: Player
  asset?: Asset
}

const Ui = (props: PropsUi) => {
  const { asset, player } = props 
  const playerEnabled = usePrestoEnabledState(player)

  return (
    <PlayerControls>

      <div className="pp-yt-gradient-bottom"></div>

      {/* We are creating a vertical bar to build our controls top to bottom */}
      <VerticalBar className={'pp-ui-spacer'} style={{ gap: '0', position: 'absolute' }}>
        {/* The first horizontal row shows some custom title for the content */}
        <HorizontalBar>
          <div style={{ flexGrow: 1 }}>
            <div>
              <Label label={asset?.title} className={'pp-ui-label-title'}/>
            </div>
            <div>
              <Label label={asset?.subtitle} className={'pp-ui-label-subtitle'}/>
            </div>
          </div>
        </HorizontalBar>

        {/* We add a spacer to push the rest of the content to the bottom */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'stretch' }}>
          <PlayPauseButton  className={'pp-yt-center-toggle'} style={{ width: '100%', display:playerEnabled ? 'block' : 'none' }}>
            <div className={'pp-yt-center-background'}></div>
          </PlayPauseButton>
        </div>

        {/* We create a horizontal bar for the thumbnails */}
        <HorizontalBar>
          <HoverContainer>
            <Thumbnail moveRelativeToParent={false}/>
            <CurrentTime disableHoveringDisplay={false}/>
          </HoverContainer>
        </HorizontalBar>


        <VerticalBar>
          <HorizontalBar style={{ alignItems: 'flex-end', marginBottom: '-8px' }}>
            <SeekBar  adjustWhileDragging={true} enableThumbnailSlider={false} notFocusable={true}/>
          </HorizontalBar>

          <HorizontalBar className={'pp-yt-bottom-bar'}>
            <PlayPauseButton  resetRate={true}/>
            <MuteButton >
              <VolumeBar  notFocusable={true} adjustWhileDragging={true}/>
            </MuteButton>

            <HorizontalBar className={'pp-ui-yt-timebar'}>
              <CurrentTime  disableHoveringDisplay={true}>
                  &nbsp;/&nbsp;
              </CurrentTime>
              <Duration />
            </HorizontalBar>

            <Spacer/>

            <FullscreenButton />
          </HorizontalBar>
        </VerticalBar>
      </VerticalBar>

    </PlayerControls>
  )
}
