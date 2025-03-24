import React, { useRef } from 'react'

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
import { PageProps } from './types'

/**
 * A custom player skin assembled from our UI components.
 */
export const CustomControlsPage = (props: PageProps) => {
  const asset = props.asset
  const playerConfig = asset?.config

  return (
    <div>
      <PlayerSurface
        player={props.player}
        config={playerConfig}
        playsInline={true}
        autoload={props.autoload}
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
  const seekbarRef = useRef<HTMLDivElement>(null)
  
  return (
    <PlayerControls >
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
          <HoverContainer
            style={{ margin: 0, padding: 0 }}
            targetRef={seekbarRef}>
            <Thumbnail moveRelativeToParent={false} style={{ borderRadius: '0.3rem', height: 100 }}/>
            <CurrentTime disableHoveringDisplay={false}/>
          </HoverContainer>
        </HorizontalBar>

        {/* The primary controls at the bottom */}
        <HorizontalBar style={{ padding: '8px' }}>
          <PlayPauseButton  resetRate={true}/>
          <CurrentTime />
          <SeekBar ref={seekbarRef}  adjustWhileDragging={true}
            enableThumbnailSlider={false} adjustWithKeyboard={true}
            style={{ marginInline: '0px' }}/>
          <TimeLeft />
          <FullscreenButton />
        </HorizontalBar>
      </VerticalBar>
    </PlayerControls>
  )
}
