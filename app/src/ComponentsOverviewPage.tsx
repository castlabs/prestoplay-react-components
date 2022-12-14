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
import "@castlabs/prestoplay/cl.hls"
import "@castlabs/prestoplay/cl.htmlcue"
import "@castlabs/prestoplay/cl.ttml"
import "@castlabs/prestoplay/cl.vtt"
import SeekButton from "../../src/components/SeekButton";
import BufferingIndicator from "../../src/components/BufferingIndicator";
import RateButton from "../../src/components/RateButton";
import MuteButton from "../../src/components/MuteButton";
import VolumeBar from "../../src/components/VolumeBar";
import Duration from "../../src/components/Duration";
import RateText from "../../src/components/RateText";
import TrackGroupButton from "../../src/components/TrackGroupButton";
import TrackSelectionList from "../../src/components/TrackSelectionList";


export const ComponentsOverviewPage = (props: {
  asset?: Asset
  autoload?: boolean
}) => {
  // We track the thumb position to showcase how we can manually load thumbs
  let [thumbPosition, setThumbPosition] = useState<number | undefined>();

  // Create the player as state of this component
  let [player, _] = useState(new Player((pp:any) => {
    pp.use(clpp.dash.DashComponent);
    pp.use(clpp.hls.HlsComponent);
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }));

  // Create a ref to the player surface component. We use this here to pass it
  // to the fullscreen button to make put the player surface to fullscreen
  let playerSurfaceRef = createRef<HTMLDivElement>();


  function manuallyLoadThumb() {
    setThumbPosition(player.position)
  }

  const asset = props.asset
  const playerConfig = asset?.config

  return (
    <div>

      <PlayerSurface ref={playerSurfaceRef}
                     player={player}
                     config={playerConfig}
                     autoload={props.autoload}
                     playsInline={true}
                     style={{height: "320px"}}>
      </PlayerSurface>

      <div>
        <h2>Player Components</h2>

        <HorizontalBar>
          <PlayPauseButton player={player} resetRate={true}
                           disableIcon={false}/>
        </HorizontalBar>

        <HorizontalBar>
          <SeekButton player={player} seconds={-10}/>
        </HorizontalBar>
        <HorizontalBar>
          <SeekButton player={player} seconds={10}/>
        </HorizontalBar>

        <HorizontalBar>
          <BufferingIndicator player={player}/>
        </HorizontalBar>

        <HorizontalBar>
          <RateButton player={player} factor={2}/>
        </HorizontalBar>
        <HorizontalBar>
          <RateButton player={player} factor={0.5}/>
        </HorizontalBar>

        <HorizontalBar>
          <MuteButton player={player}/>
          <VolumeBar player={player} adjustWhileDragging={true}/>
        </HorizontalBar>

        <HorizontalBar>
          <CurrentTime player={player}/>
          <TimeLeft player={player}/>
          <Duration player={player}/>
          <RateText player={player}/>
        </HorizontalBar>

        <HorizontalBar>
          <button type={"button"} onClick={manuallyLoadThumb}>Load Thumb
          </button>
          <button type={"button"} onClick={() => {
            setThumbPosition(-1)
          }}>Reset Thumb
          </button>
          <Thumbnail player={player} position={thumbPosition}
                     listenToHover={false}/>
        </HorizontalBar>

        <HorizontalBar>
          <SeekBar player={player} adjustWhileDragging={true}
                   enableThumbnailSlider={true}/>
        </HorizontalBar>

        <HorizontalBar>
          <TrackGroupButton type={"video"} label={"Video"} player={player}/>
          <TrackGroupButton type={"audio"} label={"Audio"} player={player}/>
          <TrackGroupButton type={"text"} label={"Text"} player={player}
                            hideWhenUnavailable={true}/>
        </HorizontalBar>

        <HorizontalBar>
          <TrackSelectionList player={player} type={"video"}/>
          <TrackSelectionList player={player} type={"audio"}/>
          <TrackSelectionList player={player} type={"text"}/>
        </HorizontalBar>


      </div>

    </div>
  )
}
