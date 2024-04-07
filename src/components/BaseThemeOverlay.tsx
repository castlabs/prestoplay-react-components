import React from 'react'

import { ControlsVisibilityMode } from '../services/controls'

import { BufferingIndicator } from './BufferingIndicator'
import { CurrentTime } from './CurrentTime'
import { Duration } from './Duration'
import { ForSize } from './ForSize'
import { FullscreenButton } from './FullscreenButton'
import { HorizontalBar } from './HorizontalBar'
import { Label } from './Label'
import {
  MenuSlidein,
  DEFAULT_SELECTION_OPTIONS,
  SelectionOption,
} from './MenuSlidein'
import { MenuSlideinToggleButton } from './MenuSlideinToggleButton'
import { MuteButton } from './MuteButton'
import { PlayerControls } from './PlayerControls'
import { PlayPauseButton } from './PlayPauseButton'
import { PosterImage } from './PosterImage'
import { SeekBar } from './SeekBar'
import { SeekButton } from './SeekButton'
import { Spacer } from './Spacer'
import { StartButton } from './StartButton'
import { Thumbnail } from './Thumbnail'
import { VerticalBar } from './VerticalBar'
import { VolumeBar } from './VolumeBar'

import type { BaseComponentProps } from './types'


/**
 * Properties of the basic theme overlay
 */
export interface BaseThemeOverlayProps extends BaseComponentProps {
  /**
   * Creates the start button. Before the button is clicked, no video content is loaded
   * and only the poster image might be displayed. To make this work as expected
   * and not load content before the button is clicked, you need to pass `autoload=false` to
   * the player surface.
   */
  startButton?: boolean | { onClick?: () => Promise<void> }
  /**
   * Optional poster image URL. If specified, an image from the provided URL
   * will be loaded before video content is available.
   */
  posterUrl?: string
  /**
   * Options menu selection options can be configured with this property.
   */
  menuSelectionOptions?: SelectionOption[]
  /**
   * Number of seconds the seek forward button seeks forward. Defaults
   * to 10. 0 will disable the seek back button.
   */
  seekForward?: number
  /**
   * Number of seconds the seek forward button seeks backward. Defaults
   * to -10. 0 will disable the seek back button.
   */
  seekBackward?: number
  /**
   * Seekbar configuration. Defaults to 'enabled'. 'disabled' displays a disabled
   * seekbar, 'none' hides the seekbar.
   */
  seekBar?: 'enabled' | 'disabled' | 'none'
  /**
   * Visibility mode of UI controls.
   */
  controlsVisibility?: ControlsVisibilityMode
}

/**
 * Base theme overlay.
 */
export const BaseThemeOverlay = (props: BaseThemeOverlayProps) => {
  const selectionOptions = props.menuSelectionOptions ?? DEFAULT_SELECTION_OPTIONS

  const renderOptionsMenu = () => {
    if (selectionOptions.length === 0) {return}
    return <MenuSlidein selectionOptions={selectionOptions}/>
  }

  const renderTopBar = () => {
    if (selectionOptions.length === 0) {return}
    return (
      <HorizontalBar>
        <Spacer/>
        <div className="pp-ui-margin-horizontal-sm">
          <MenuSlideinToggleButton />
        </div>
      </HorizontalBar>
    )
  }

  // Some component rendering depends on configuration, and
  // we wrap the rendering code into helpers
  const renderFullscreenButton = () => {
    return <FullscreenButton />
  }

  const renderPosterImage = () => {
    if (!props.posterUrl) {return}
    return <PosterImage src={props.posterUrl} />
  }

  const renderStartButton = () => {
    if (!props.startButton) {return}
    return <StartButton onClick={typeof props.startButton === 'object' ? props.startButton.onClick : undefined}/>
  }

  return (
    <div data-testid="pp-ui-basic-theme" className={'pp-ui pp-ui-overlay pp-ui-basic-theme'} style={props.style}>
      <PlayerControls mode={props.controlsVisibility}>
        <VerticalBar className={'pp-ui-spacer'}>

          {/* Top bar */}
          {renderTopBar()}

          <Spacer/>

          {/* Thumbnails */}
          <HorizontalBar className={'pp-ui-transparent'}>
            <Thumbnail moveRelativeToParent={true}/>
          </HorizontalBar>

          {/* Bottom bar */}
          <HorizontalBar className="pp-ui-flex-space-between">
            <div className="pp-ui-row pp-ui-margin-horizontal-sm">
              <PlayPauseButton resetRate={true}/>
              <ForSize size="small">
                <SeekButton seconds={props.seekBackward ?? -10}/>
                <SeekButton seconds={props.seekForward ?? 10}/>
              </ForSize>
            </div>

            {props.seekBar === 'none' ? null : <SeekBar
              adjustWhileDragging={true}
              adjustWithKeyboard={true}
              enableThumbnailSlider={false}
              enabled={(props.seekBar ?? 'enabled') === 'enabled'}
            />}

            <div className="pp-ui-row pp-ui-margin-horizontal-sm">
              <ForSize size="small">
                <CurrentTime />
                <Label label={'/'}/>
                <Duration />
              </ForSize>

              <MuteButton />

              <ForSize size="medium">
                <VolumeBar adjustWhileDragging={true}/>
                {renderFullscreenButton()}  
              </ForSize>
            </div>
          </HorizontalBar>

        </VerticalBar>
      </PlayerControls>

      {renderOptionsMenu()}

      {renderPosterImage()}

      {renderStartButton()}

      <BufferingIndicator className="pp-ui-absolute-center" />

    </div>
  )
}
