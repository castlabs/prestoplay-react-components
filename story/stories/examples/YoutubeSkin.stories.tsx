
import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import React from 'react'
import { Helmet } from 'react-helmet'

import { Player } from '../../../src'
import { CurrentTime } from '../../../src/components/CurrentTime'
import { Duration } from '../../../src/components/Duration'
import { FullscreenButton } from '../../../src/components/FullscreenButton'
import { HorizontalBar } from '../../../src/components/HorizontalBar'
import { HoverContainer } from '../../../src/components/HoverContainer'
import { Label } from '../../../src/components/Label'
import { MuteButton } from '../../../src/components/MuteButton'
import { PlayerControls } from '../../../src/components/PlayerControls'
import { PlayerSurface } from '../../../src/components/PlayerSurface'
import { PlayPauseButton } from '../../../src/components/PlayPauseButton'
import { PlayPauseIndicator } from '../../../src/components/PlayPauseIndicator'
import { SeekBar } from '../../../src/components/SeekBar'
import { Spacer } from '../../../src/components/Spacer'
import { Thumbnail } from '../../../src/components/Thumbnail'
import { VerticalBar } from '../../../src/components/VerticalBar'
import { VolumeBar } from '../../../src/components/VolumeBar'
import { Asset, TEST_ASSETS } from '../Asset'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { youtubeStyle } from './youtubeStyle'

import type { Meta, StoryObj } from '@storybook/react'

const asset = TEST_ASSETS[0]
const playerConfig = {
  source: asset.config.source ?? '',
}

const player = new Player((pp: clpp.Player) => {
  pp.use(clpp.dash.DashComponent)
  pp.use(clpp.hls.HlsComponent)
  pp.use(clpp.htmlcue.HtmlCueComponent)
  pp.use(clpp.ttml.TtmlComponent)
  pp.use(clpp.vtt.VttComponent)
})

/**
 * A custom player skin assembled from our UI components
 * in the style of YouTube.
 */
const YoutubeSkin = () => {
  return (
    <div>
      <Helmet>
        <style>{youtubeStyle}</style>
      </Helmet>
      <PlayerSurface
        player={player}
        config={playerConfig}
        playsInline={true}
        autoload={true}
        style={{ height: '320px' }}>
        <Ui asset={asset} />
      </PlayerSurface>
    </div>
  )
}

type PropsUi = {
  asset?: Asset
}

const Ui = (props: PropsUi) => {
  const { asset } = props

  return (
    <PlayerControls>
      <div className='pp-ui-layers'>
        <div className='pp-ui-layer'>
          <PlayPauseIndicator/>
        </div>

        <div className='pp-ui-layer'>
          <div className="pp-ui-top-and-bottom-layout">

            {/* Top half: */}
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

            {/* Bottom half: */}
            <div>
              <div className="pp-yt-gradient-bottom"></div>
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
                    <CurrentTime  disableHoveringDisplay={true}>&nbsp;/&nbsp;</CurrentTime>
                    <Duration />
                  </HorizontalBar>

                  <Spacer/>

                  <FullscreenButton />
                </HorizontalBar>
              </VerticalBar>
            </div>
          </div>
        </div>
      </div>
   
    </PlayerControls>
  )
}


const meta: Meta<typeof YoutubeSkin> = {
  title: 'examples/Youtube Skin',
  component: YoutubeSkin,
}

export default meta

type Story = StoryObj<typeof YoutubeSkin>

export const Primary: Story = {
}
