export const SOURCE_YOUTUBE_SKIN = `
import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import { Player } from '@castlabs/prestoplay-react-components'
import { CurrentTime } from '@castlabs/prestoplay-react-components/components/CurrentTime'
import { Duration } from '@castlabs/prestoplay-react-components/components/Duration'
import { FullscreenButton } from '@castlabs/prestoplay-react-components/components/FullscreenButton'
import { HorizontalBar } from '@castlabs/prestoplay-react-components/components/HorizontalBar'
import { HoverContainer } from '@castlabs/prestoplay-react-components/components/HoverContainer'
import { Label } from '@castlabs/prestoplay-react-components/components/Label'
import { MuteButton } from '@castlabs/prestoplay-react-components/components/MuteButton'
import { PlayerControls } from '@castlabs/prestoplay-react-components/components/PlayerControls'
import { PlayerSurface } from '@castlabs/prestoplay-react-components/components/PlayerSurface'
import { PlayPauseButton } from '@castlabs/prestoplay-react-components/components/PlayPauseButton'
import { PlayPauseIndicator } from '@castlabs/prestoplay-react-components/components/PlayPauseIndicator'
import { SeekBar } from '@castlabs/prestoplay-react-components/components/SeekBar'
import { Spacer } from '@castlabs/prestoplay-react-components/components/Spacer'
import { Thumbnail } from '@castlabs/prestoplay-react-components/components/Thumbnail'
import { VerticalBar } from '@castlabs/prestoplay-react-components/components/VerticalBar'
import { VolumeBar } from '@castlabs/prestoplay-react-components/components/VolumeBar'
import React from 'react'

import '@castlabs/prestoplay/clpp.styles.css'
import '@castlabs/prestoplay-react-components/themes/pp-ui-base-theme.css'
import 'youtube-style.css'

import type { Meta, StoryObj } from '@storybook/react'

const asset =   {
  title: 'Maldives',
  subtitle: 'State of the Mahal Dibiyat',
  config: {
    source: 'https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd',
  },
}

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
    <PlayerSurface
      player={player}
      config={playerConfig}
      playsInline={true}
      autoload={true}
      style={{ height: '320px' }}>
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
    </PlayerSurface>
  )
}
`

export const SOURCE_YOUTUBE_CSS = `
.pp-ui {
  --pp-ui-slider-range-progress: rgb(255, 0, 0);
  --pp-ui-slider-range-thumb-bg: rgb(255, 0, 0);
  --pp-ui-slider-range-bg: rgba(255, 255, 255, 0.2);
  --pp-ui-slider-height: 3px;
  --pp-ui-slider-border-radius: 0;
  --pp-ui-slider-height-interaction: 5px;
  --pp-ui-slider-size: 10px;
  --pp-ui-slider-thumb-transform: translateX(-50%);

  --pp-ui-label-font-size: 13px;

  --pp-horizontal-bar-bg-color: transparent;

  --pp-ui-thumbnail-height: 120px;

  --pp-ui-bar-gap: 1rem;

  font-family: "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
  color: rgb(221, 221, 221);;

  --pp-ui-icon-fullscreen-enter: url("../../../src/themes/resources/fullscreen-2.svg") no-repeat 50% 50%;
  --pp-ui-icon-fullscreen-exit: url("../../../src/themes/resources/fullscreen-2_exit.svg") no-repeat 50% 50%;
}

.pp-ui-button:hover {
  color: var(--pp-hover-color);
  background-color: transparent;
  border-radius: 0;
}

.pp-ui-button:focus {
  color: var(--pp-hover-color);
  background-color: transparent;
  border-radius: 0;
}

.pp-ui-hover-container-content {
  gap: .5rem;
  padding-bottom: .5rem;
}

.pp-ui-thumbnail-with-thumb {
  border: 2px solid;
  border-radius: 3px;
}


.pp-ui-mute-toggle {
  display: flex;
}

.pp-ui-volumebar {
  height: var(--pp-ui-button-size);
}

.pp-ui-mute-toggle .pp-ui-volumebar {
  width: 0;
  transition: width 250ms;

  padding-left: 0.8rem;

  --pp-ui-slider-thumb-transform: translateX(-50%);
  --pp-ui-slider-height-interaction: var(--pp-ui-slider-height);
  --pp-ui-slider-range-progress: #ffffff;
  --pp-ui-slider-range-thumb-bg: #ffffff;
}

.pp-ui-enabled.pp-ui-mute-toggle:hover .pp-ui-volumebar {
  width: 4.3rem;
}

.pp-ui-mute-toggle .pp-ui-volumebar .pp-ui-slider {
  margin-left: .25rem;
}

.pp-ui-volumebar .pp-ui-slider .pp-ui-slider-range-thumb {
  visibility: hidden;
  opacity: 0;
  transition: opacity 250ms 50ms;
}
.pp-ui-mute-toggle:hover .pp-ui-volumebar .pp-ui-slider .pp-ui-slider-range-thumb {
  visibility: visible;
  opacity: 1;
  background-color: currentColor;
}

.pp-ui-mute-toggle .pp-ui-volumebar .pp-ui-slider:hover .pp-ui-slider-range-thumb {
  visibility: visible;
}

.pp-yt-bottom-bar {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: .5rem;
}

.pp-ui-yt-timebar {
  gap: 0;
}

.pp-ui-yt-timebar .pp-ui-label {
  margin: 0;
}

.pp-yt-center-toggle {
  position: relative;
}

.pp-ui-label-title {
  font-size: 1.2em;
}

.pp-yt-gradient-bottom {
  height: 146px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACSCAYAAACE56BkAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAkgAAAABvhMA+AAAAf0lEQVQoFXWR2w6AMAhD5/T/P9kLx8STVLYHUmgpbBvjd7b5lAij0KxwfYiaEpHikJB2rDpmmHbiWEixRCBXk4hBEvjt31Xt7XbpanZoas11l71LQj+/Ipy9lsg20JJQh4TAQ0CAulSxCJ2p6KiH1U9C1EhmsWcMpyNqpri8pjccGgXJYTY1HgAAAABJRU5ErkJggg==");
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
`
