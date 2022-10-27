import React, {createRef, useEffect, useRef, useState} from "react";
import {usePrestoEvent, usePrestoUiEvent} from "../Player";
// @ts-ignore
import {BasePlayerComponentProps, p} from "../utils";
import PlayerControls from "./PlayerControls";
import VerticalBar from "./VerticalBar";
import HorizontalBar from "./HorizontalBar";
import Spacer from "./Spacer";
import MenuSlideinToggleButton from "./MenuSlideinToggleButton";
import Thumbnail from "./Thumbnail";
import PlayPauseButton from "./PlayPauseButton";
import SeekButton from "./SeekButton";
import SeekBar from "./SeekBar";
import CurrentTime from "./CurrentTime";
import Label from "./Label";
import Duration from "./Duration";
import FullscreenButton from "./FullscreenButton";
import MenuSlidein, {
  DEFAULT_SELECTION_OPTIONS,
  SelectionOption
} from "./MenuSlidein";
import PosterImage from "./PosterImage";
import StartButton from "./StartButton";
import BufferingIndicator from "./BufferingIndicator";
import MuteButton from "./MuteButton";
import VolumeBar from "./VolumeBar";


/**
 * Properties of the basic theme overlay
 */
export interface BaseThemeOverlayProps extends BasePlayerComponentProps {
  /**
   * Player configuration that is used to create a "start" button that loads
   * the configuration. Before the button is clicked, no video content is loaded
   * and only the poster image might be displayed. This is optional and if the
   * configuration is not provided, the start button will not be rendered.
   */
  startConfig?: any
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
}

const BaseThemeOverlay = (props: BaseThemeOverlayProps) => {
  let selectionOptions = props.menuSelectionOptions || DEFAULT_SELECTION_OPTIONS

  const renderOptionsMenuButton = () => {
    if(!selectionOptions || selectionOptions.length == 0) return
    return <MenuSlideinToggleButton player={props.player}/>
  }
  const renderOptionsMenu = () => {
    if(!selectionOptions || selectionOptions.length == 0) return
    return <MenuSlidein player={props.player} selectionOptions={selectionOptions}/>
  }

  const renderTopBar = () => {
    if(!selectionOptions || selectionOptions.length == 0) return
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
    if (!props.fullscreenRef) return
    return <FullscreenButton fullscreenContainer={props.fullscreenRef}
                             player={props.player}/>
  }

  const renderPosterImage = () => {
    if (!props.posterUrl) return
    return <PosterImage src={props.posterUrl} player={props.player}/>
  }

  const renderStartButton = () => {
    if (!props.startConfig) return
    return <StartButton player={props.player}
                        config={props.startConfig}
                        className={"pp-ui-absolute-center"}/>
  }

  return (
    <div className={"pp-ui pp-ui-overlay pp-ui-basic-theme"}>
      <PlayerControls player={props.player}>
        <VerticalBar className={"pp-ui-transparent"}>

          {renderTopBar()}

          <Spacer/>

          <HorizontalBar className={"pp-ui-transparent"}>
            <Thumbnail player={props.player} listenToHover={true}
                       moveRelativeToParent={true}/>
          </HorizontalBar>

          <HorizontalBar>
            <PlayPauseButton player={props.player} resetRate={true}/>
            <SeekButton player={props.player} seconds={p(props.seekBackward, -10)}/>
            <SeekButton player={props.player} seconds={p(props.seekForward, 10)}/>
            <SeekBar player={props.player} adjustWhileDragging={true}
                     enableThumbnailSlider={false}/>

            <CurrentTime player={props.player}/>
            <Label label={"/"}/>
            <Duration player={props.player}/>

            <MuteButton player={props.player}/>
            <VolumeBar player={props.player} adjustWhileDragging={true}/>

            {renderFullscreenButton()}

          </HorizontalBar>

        </VerticalBar>
      </PlayerControls>

      {renderOptionsMenu()}

      {renderPosterImage()}

      {renderStartButton()}

      <BufferingIndicator player={props.player}
                          className={"pp-ui-absolute-center"}/>

    </div>
  );
}

export default BaseThemeOverlay
