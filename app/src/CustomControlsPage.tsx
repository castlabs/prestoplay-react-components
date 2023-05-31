import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import React, { createRef, useState } from 'react'

import { Player } from '../../src'
import { CurrentTime } from '../../src/components/CurrentTime'
import { FullscreenButton } from '../../src/components/FullscreenButton'
import { HorizontalBar } from '../../src/components/HorizontalBar'
import { HoverContainer } from '../../src/components/HoverContainer'
import { Label } from '../../src/components/Label'
import { PlayerControls } from '../../src/components/PlayerControls'
import { PlayerSurface } from '../../src/components/PlayerSurface'
import { PlayPauseButton } from '../../src/components/PlayPauseButton'
import { SeekBar } from '../../src/components/SeekBar'
import { Spacer } from '../../src/components/Spacer'
import { Thumbnail } from '../../src/components/Thumbnail'
import { TimeLeft } from '../../src/components/TimeLeft'
import { VerticalBar } from '../../src/components/VerticalBar'

import { Asset } from './Asset'

export const CustomControlsPage = (props: {
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

  // Create a ref to the player surface component. We use this here to pass it
  // to the fullscreen button to make put the player surface to fullscreen
  const playerSurfaceRef = createRef<HTMLDivElement>()
  const seekbarRef = createRef<HTMLDivElement>()

  const asset = props.asset
  const playerConfig = asset?.config

  return (
    <div>

      <PlayerSurface ref={playerSurfaceRef}
        player={player}
        config={playerConfig}
        playsInline={true}
        autoload={props.autoload}
        style={{ height: '320px' }}>
        <PlayerControls player={player}>
          {/* We are creating a vertical bar to build our controls top to bottom */}
          <VerticalBar className={'pp-ui-spacer'}>
            {/* The first horizontal row shows some custom title for the content */}
            <HorizontalBar style={{ padding: '8px' }}>
              <div>
                <div>
                  <Label label={asset?.title} className={'pp-ui-label-title'}/>
                </div>
                <div>
                  <Label label={asset?.subtitle} className={'pp-ui-label-subtitle'}/>
                </div>
              </div>
            </HorizontalBar>

            {/* We add a spacer to push the rest of the content to the bottom */}
            <Spacer/>

            {/* We create a horizontal bar for the thumbnails */}
            <HorizontalBar className={'pp-ui-transparent'}>
              <HoverContainer player={player} listenToHover={true}
                notTrackFullWidth={false} style={{ margin: 0, padding: 0 }}
                targetRef={seekbarRef}>
                <Thumbnail player={player} listenToHover={true}
                  moveRelativeToParent={false} style={{ borderRadius: '1rem' }}/>
                <CurrentTime player={player} disableHoveringDisplay={false}/>
              </HoverContainer>
            </HorizontalBar>

            {/* The primary controls at the bottom */}
            <HorizontalBar style={{ padding: '8px' }}>
              <PlayPauseButton player={player} resetRate={true}/>
              <CurrentTime player={player}/>
              <SeekBar ref={seekbarRef} player={player} adjustWhileDragging={true}
                enableThumbnailSlider={false} adjustWithKeyboard={true}
                style={{ marginInline: '0px' }}/>
              <TimeLeft player={player}/>
              <FullscreenButton fullscreenContainer={playerSurfaceRef} player={player}/>
            </HorizontalBar>
          </VerticalBar>
        </PlayerControls>
      </PlayerSurface>

    </div>
  )
}
