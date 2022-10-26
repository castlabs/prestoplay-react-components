import React from 'react';
import {Player} from "../../src/Player";

// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import PlayerSurface from "../../src/components/PlayerSurface";
import PlayPauseButton from "../../src/components/PlayPauseButton";
import CurrentTime from "../../src/components/CurrentTime";
import Duration from "../../src/components/Duration";
import SeekBar from "../../src/components/SeekBar";
import SeekButton from "../../src/components/SeekButton";
import RateButton from "../../src/components/RateButton";
import MuteButton from "../../src/components/MuteButton";
import VolumeBar from "../../src/components/VolumeBar";
import RateText from "../../src/components/RateText";
import TrackSelectionList from "../../src/components/TrackSelectionList";
import BufferingIndicator from "../../src/components/BufferingIndicator";
import TimeLeft from "../../src/components/TimeLeft";
// make sure this is processed by rollup, otherwise we might not
// load the referenced images
import "../../src/pp-ui-base-theme.css"

import HorizontalBar from "../../src/components/HorizontalBar";

function App() {
  const player = new Player()
  player.use(clpp.dash.DashComponent);

  return (
    <div>
      <h1>Player & Player Surface</h1>
      <PlayerSurface player={player}
                     src={"https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd"}>
      </PlayerSurface>

      <div>
        <h2>Player Components</h2>

        <HorizontalBar>
          <PlayPauseButton player={player} resetRate={true} disableIcon={false}/>
        </HorizontalBar>

        <HorizontalBar>
          <SeekButton player={player} seconds={-10}/>
        </HorizontalBar>
        <HorizontalBar>
          <SeekButton player={player} seconds={10}/>
        </HorizontalBar>

        <BufferingIndicator player={player}/>



        <HorizontalBar>
          <RateButton player={player} factor={2}/>
        </HorizontalBar>
        <HorizontalBar>
          <RateButton player={player} factor={0.5}/>
        </HorizontalBar>

        <HorizontalBar>
          <MuteButton player={player} />
          <VolumeBar player={player} adjustWhileDragging={true}/>
        </HorizontalBar>

        <HorizontalBar>
          <CurrentTime player={player}/>
          <TimeLeft player={player}/>
          <Duration player={player}/>
          <RateText player={player}/>
        </HorizontalBar>

        <HorizontalBar>
          <SeekBar player={player} adjustWhileDragging={true}/>
        </HorizontalBar>

        <HorizontalBar>
          <TrackSelectionList player={player} title={"Track Selection"} types={["audio","text", "video"]}/>
        </HorizontalBar>


      </div>
    </div>
  );
}

export default App;
