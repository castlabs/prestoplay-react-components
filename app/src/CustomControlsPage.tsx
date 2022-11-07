import {Asset} from "./Asset";
import PlayerSurface from "../../src/components/PlayerSurface";
import React, {createRef, useState} from "react";
import {Player} from "../../src";

import PlayerControls from "../../src/components/PlayerControls";
import VerticalBar from "../../src/components/VerticalBar";
import HorizontalBar from "../../src/components/HorizontalBar";
import Label from "../../src/components/Label";
import Spacer from "../../src/components/Spacer";
import Thumbnail from "../../src/components/Thumbnail";
import PlayPauseButton from "../../src/components/PlayPauseButton";
import CurrentTime from "../../src/components/CurrentTime";
import SeekBar from "../../src/components/SeekBar";
import TimeLeft from "../../src/components/TimeLeft";
import FullscreenButton from "../../src/components/FullscreenButton";

// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import "@castlabs/prestoplay/cl.htmlcue"
import "@castlabs/prestoplay/cl.ttml"
import "@castlabs/prestoplay/cl.vtt"


export const CustomControlsPage = (props: {
  asset?: Asset,
  autoload?: boolean
}) => {

  // Create the player as state of this component
  let [player, _] = useState(new Player((pp:any) => {
    pp.use(clpp.dash.DashComponent);
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }));

  // Create a ref to the player surface component. We use this here to pass it
  // to the fullscreen button to make put the player surface to fullscreen
  let playerSurfaceRef = createRef<HTMLDivElement>();

  const asset = props.asset
  const playerConfig = asset?.config

  return (
    <div>

      <PlayerSurface ref={playerSurfaceRef} player={player} config={playerConfig} autoload={props.autoload} style={{height: "320px"}}>
        <PlayerControls player={player}>
          {/* We are creating a vertical bar to build our controls top to bottom */}
          <VerticalBar className={"pp-ui-transparent"}>
            {/* The first horizontal row shows some custom title for the content */}
            <HorizontalBar>
              <div>
                <div>
                  <Label label={asset?.title} className={"pp-ui-label-title"}/>
                </div>
                <div>
                  <Label label={asset?.subtitle} className={"pp-ui-label-subtitle"}/>
                </div>
              </div>
            </HorizontalBar>

            {/* We add a spacer to push the rest of the content to the bottom */}
            <Spacer/>

            {/* We create a horizontal bar for the thumbnails */}
            <HorizontalBar className={"pp-ui-transparent"}>
              <Thumbnail player={player} listenToHover={true} moveRelativeToParent={true}/>
            </HorizontalBar>

            {/* The primary controls at the bottom */}
            <HorizontalBar>
              <PlayPauseButton player={player} resetRate={true}/>
              <CurrentTime player={player}/>
              <SeekBar player={player} adjustWhileDragging={true} enableThumbnailSlider={false}/>
              <TimeLeft player={player}/>
              <FullscreenButton fullscreenContainer={playerSurfaceRef} player={player}/>
            </HorizontalBar>
          </VerticalBar>
        </PlayerControls>
      </PlayerSurface>

    </div>
  )
}
