import { clpp } from '@castlabs/prestoplay'
import React, { useState } from 'react'

import { Player } from '../../src'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import { BufferingIndicator } from '../../src/components/BufferingIndicator'
import { CurrentTime } from '../../src/components/CurrentTime'
import { Duration } from '../../src/components/Duration'
import { HorizontalBar } from '../../src/components/HorizontalBar'
import { MuteButton } from '../../src/components/MuteButton'
import { PlayerSurface } from '../../src/components/PlayerSurface'
import { PlayPauseButton } from '../../src/components/PlayPauseButton'
import { RateButton } from '../../src/components/RateButton'
import { RateText } from '../../src/components/RateText'
import { SeekBar } from '../../src/components/SeekBar'
import { SeekButton } from '../../src/components/SeekButton'
import { Thumbnail } from '../../src/components/Thumbnail'
import { TimeLeft } from '../../src/components/TimeLeft'
import { TrackGroupButton } from '../../src/components/TrackGroupButton'
import { TrackSelectionList } from '../../src/components/TrackSelectionList'
import { VolumeBar } from '../../src/components/VolumeBar'
import { PrestoContext, PrestoContextType } from '../../src/context/PrestoContext'

import { Asset } from './Asset'


/**
 * An overview of available UI components that can be
 * assembled to create a skin.
 */
export const ComponentsOverviewPage = (props: {
  asset?: Asset
  autoload?: boolean
}) => {
  // We track the thumb position to showcase how we can manually load thumbs
  const [thumbPosition, setThumbPosition] = useState<number | undefined>()
  const [context, setContext] = useState<PrestoContextType|null>(null)

  // Create the player as state of this component
  const [player] = useState(new Player((pp: clpp.Player) => {
    pp.use(clpp.dash.DashComponent)
    pp.use(clpp.hls.HlsComponent)
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }))

  function manuallyLoadThumb() {
    setThumbPosition(player.position)
  }

  const asset = props.asset
  const playerConfig = asset?.config

  return (
    <div>
      <PlayerSurface
        player={player}
        config={playerConfig}
        autoload={props.autoload}
        playsInline={true}
        style={{ height: '320px' }}
        onContext={setContext}
      ></PlayerSurface>

      {context ? 
        <PrestoContext.Provider value={context}>
          <div>
            <h2>Player Components</h2>

            <HorizontalBar>
              <PlayPauseButton  resetRate={true}
                disableIcon={false}/>
            </HorizontalBar>

            <HorizontalBar>
              <SeekButton  seconds={-10}/>
            </HorizontalBar>
            <HorizontalBar>
              <SeekButton  seconds={10}/>
            </HorizontalBar>

            <HorizontalBar>
              <BufferingIndicator />
            </HorizontalBar>

            <HorizontalBar>
              <RateButton  factor={2}/>
            </HorizontalBar>
            <HorizontalBar>
              <RateButton  factor={0.5}/>
            </HorizontalBar>

            <HorizontalBar>
              <MuteButton />
              <VolumeBar  adjustWhileDragging={true}/>
            </HorizontalBar>

            <HorizontalBar>
              <CurrentTime />
              <TimeLeft />
              <Duration />
              <RateText />
            </HorizontalBar>

            <HorizontalBar>
              <button type={'button'} onClick={manuallyLoadThumb}>Load Thumb
              </button>
              <button type={'button'} onClick={() => {
                setThumbPosition(-1)
              }}>Reset Thumb
              </button>
              <Thumbnail position={thumbPosition} listenToHover={false} />
            </HorizontalBar>

            <HorizontalBar>
              <SeekBar  adjustWhileDragging={true}
                enableThumbnailSlider={true}/>
            </HorizontalBar>

            <HorizontalBar>
              <TrackGroupButton type={'video'} label={'Video'} />
              <TrackGroupButton type={'audio'} label={'Audio'} />
              <TrackGroupButton type={'text'} label={'Text'} 
                hideWhenUnavailable={true}/>
            </HorizontalBar>

            <HorizontalBar>
              <TrackSelectionList type={'video'}/>
              <TrackSelectionList type={'audio'}/>
              <TrackSelectionList type={'text'}/>
            </HorizontalBar>

          </div>
        </PrestoContext.Provider>
        : null
      }

    </div>
  )
}
