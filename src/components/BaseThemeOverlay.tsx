import React from 'react'

import { BasePlayerComponentProps } from '../utils'

import BufferingIndicator from './BufferingIndicator'
import CurrentTime from './CurrentTime'
import Duration from './Duration'
import FullscreenButton from './FullscreenButton'
import HorizontalBar from './HorizontalBar'
import Label from './Label'
import MenuSlidein, {
  DEFAULT_SELECTION_OPTIONS,
  SelectionOption,
} from './MenuSlidein'
import MenuSlideinToggleButton from './MenuSlideinToggleButton'
import MuteButton from './MuteButton'
import PlayerControls from './PlayerControls'
import PlayPauseButton from './PlayPauseButton'
import PosterImage from './PosterImage'
import SeekBar from './SeekBar'
import SeekButton from './SeekButton'
import Spacer from './Spacer'
import StartButton from './StartButton'
import Thumbnail from './Thumbnail'
import VerticalBar from './VerticalBar'
import VolumeBar from './VolumeBar'


/**
 * Properties of the basic theme overlay
 */
export interface BaseThemeOverlayProps extends BasePlayerComponentProps {
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
   * If a ref is passed, the HTML element that is reference is the one that will
   * be put into fullscreen mode if the fullscreen button is used
   */
  fullscreenRef?: React.MutableRefObject<HTMLElement | null>
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
}

export const BaseThemeOverlay = (props: BaseThemeOverlayProps) => {
  const selectionOptions = props.menuSelectionOptions || DEFAULT_SELECTION_OPTIONS

  const renderOptionsMenuButton = () => {
    if(!selectionOptions || selectionOptions.length == 0) {return}
    
    return (
      <div className="pp-ui-margin-horizontal-sm">
        <MenuSlideinToggleButton player={props.player} />
      </div>
    )
  }

  const renderOptionsMenu = () => {
    if(!selectionOptions || selectionOptions.length == 0) {return}
    return <MenuSlidein player={props.player} selectionOptions={selectionOptions}/>
  }

  const renderTopBar = () => {
    if(!selectionOptions || selectionOptions.length == 0) {return}
    return (
      <HorizontalBar>
        <Spacer/>
        {renderOptionsMenuButton()}
      </HorizontalBar>
    )
  }

  // Some component rendering depends on configuration, and
  // we wrap the rendering code into helpers
  const renderFullscreenButton = () => {
    if (!props.fullscreenRef) {return}
    return <FullscreenButton fullscreenContainer={props.fullscreenRef}
      player={props.player}/>
  }

  const renderPosterImage = () => {
    if (!props.posterUrl) {return}
    return <PosterImage src={props.posterUrl} player={props.player}/>
  }

  const renderStartButton = () => {
    if (!props.startButton) {return}
    return <StartButton player={props.player}
      onClick={typeof props.startButton === 'object' ? props.startButton.onClick : undefined}/>
  }

  return (
    <div className={'pp-ui pp-ui-overlay pp-ui-basic-theme'}>
      <PlayerControls player={props.player}>
        <VerticalBar className={'pp-ui-spacer'}>

          {/* Top bar */}
          {renderTopBar()}

          <Spacer/>

          {/* Thumbnails */}
          <HorizontalBar className={'pp-ui-transparent'}>
            <Thumbnail player={props.player} listenToHover={true}
              moveRelativeToParent={true}/>
          </HorizontalBar>

          {/* Bottom bar */}
          <HorizontalBar className="pp-ui-flex-space-between">
            <div className="pp-ui-row pp-ui-margin-horizontal-sm">
              <PlayPauseButton player={props.player} resetRate={true}/>
              <SeekButton player={props.player} seconds={props.seekBackward ?? -10}/>
              <SeekButton player={props.player} seconds={props.seekForward ?? 10}/>

              {props.seekBar === 'none' ? null : <SeekBar
                player={props.player}
                adjustWhileDragging={true}
                adjustWithKeyboard={true}
                enableThumbnailSlider={false}
                enabled={(props.seekBar ?? 'enabled') === 'enabled'}
              />}
            </div>
            
            <div className="pp-ui-row pp-ui-margin-horizontal-sm">
              <CurrentTime player={props.player}/>
              <Label label={'/'}/>
              <Duration player={props.player}/>

              <MuteButton player={props.player}/>
              <VolumeBar player={props.player} adjustWhileDragging={true}/>

              {renderFullscreenButton()}  
            </div>
          </HorizontalBar>

        </VerticalBar>
      </PlayerControls>

      {renderOptionsMenu()}

      {renderPosterImage()}

      {renderStartButton()}

      <BufferingIndicator player={props.player}
        className={'pp-ui-absolute-center'}/>

    </div>
  )
}

export default BaseThemeOverlay
