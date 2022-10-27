import React, {createRef, useState} from 'react';

// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import "@castlabs/prestoplay/cl.thumbnails"
import "@castlabs/prestoplay/cl.htmlcue"
import "@castlabs/prestoplay/cl.ttml"
import "@castlabs/prestoplay/cl.vtt"


import {DefaultTrackLabelerOptions, Player} from "../../src/Player";
import PlayerSurface from "../../src/components/PlayerSurface";
import BaseThemeOverlay from "../../src/components/BaseThemeOverlay";

import PlayPauseButton from "../../src/components/PlayPauseButton";
import CurrentTime from "../../src/components/CurrentTime";
import Duration from "../../src/components/Duration";
import SeekBar from "../../src/components/SeekBar";
import SeekButton from "../../src/components/SeekButton";
import RateButton from "../../src/components/RateButton";
import MuteButton from "../../src/components/MuteButton";
import VolumeBar from "../../src/components/VolumeBar";
import RateText from "../../src/components/RateText";
import BufferingIndicator from "../../src/components/BufferingIndicator";
import TimeLeft from "../../src/components/TimeLeft";

import HorizontalBar from "../../src/components/HorizontalBar";
import {TrackGroupButton} from "../../src/components/TrackGroupButton";
import Thumbnail from "../../src/components/Thumbnail";
import TrackSelectionList from "../../src/components/TrackSelectionList";
import PlayerControls from "../../src/components/PlayerControls";
import VerticalBar from "../../src/components/VerticalBar";
import Spacer from "../../src/components/Spacer";
import Label from "../../src/components/Label";
import FullscreenButton from "../../src/components/FullscreenButton";

// load the player styles
import "@castlabs/prestoplay/clpp.styles.css"
// load the theme
import "../../src/themes/pp-ui-base-theme.css"


const CONFIG_1 = {
  config: {
    source: "https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd",
    autoplay: true,
    muted: true
  },
  poster: "https://static01.nyt.com/images/2022/08/31/realestate/31IHH-Maldives-slide-XK43/31IHH-Maldives-slide-XK43-superJumbo.jpg?quality=75&auto=webp&disable=upscale",
  autoload: true
}

const CONFIG_2 = {
  config: {
    source: {
      url: "https://content.players.castlabs.com/demos/drm-agent/manifest.mpd",
      type: "application/dash+xml",
      drmProtected: true
    },
    autoplay: true,
    muted: true,
    drm: {
      env: "DRMtoday_STAGING",
      customData: {
        merchant: "client_dev",
        userId: "purchase",
        sessionId: "default",
      }
    },
  },
  autoload: false,
  poster: "https://ddz4ak4pa3d19.cloudfront.net/38/38851bb3f4b744829d281b115df2aa3c/38851bb3f4b744829d281b115df2aa3c.png?Expires=1667168630&Signature=rzYA0vUNAYCrdLnfukPbgHMUIhLbqLNFmQiAL7b0GPtzaQ850rZW8o3n7vIMuhvjyS3sg7dszZTuu4Q4W356R-KozixHUaFA5kvKN08g5wcLl0NKI4Cmjdn9WIIyPBK~OzUEjPps6-9tvZGAG7YC0GvtVM8d~oVIKHb81sPa0w~xxqPS7BKYsCj-umfTWnfTW0gKqcE~DD3ki6xoqrVd8CRZgxuvA4roMrGDx6MFr1yp95129v3W647D0jWmzIZ6bZQ9TBZdE6TvPHokOLGmWtxQHPb8WIIaVhWO1bo1fb0ERVS4bu1JItKZIxZ~NH1MADyFFEtAYLgfTdwzwVwKQg__&Key-Pair-Id=APKAJZFE4UDHH3WZXVDA"
}

const CONFIG_3 = {
  config: {
    source: "https://akamaibroadcasteruseast.akamaized.net/cmaf/live/657078/akasource/out.mpd",
    autoplay: true,
    muted: true
  },
  autoload: false
}

function App() {
  // We track the thumb position to showcase how we can manually load thumbs
  let [thumbPosition, setThumbPosition] = useState<number | undefined>();

  // We track the configuration here to make sure we can dynamically change it
  let [config, setConfig] = useState<any>(CONFIG_2);

  // We create a state to track the player. Note that we pass a callback
  // that received the final player instance once it is attached to a video
  // element. This should be used to load plugin and interact with the player
  // API before content is loaded.
  let [player, setPlayer] = useState(new Player((pp:any) => {
    pp.use(clpp.dash.DashComponent);
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }));

  // Create a ref to the player surface component. We use this here to pass it
  // to the fullscreen button to make put the player surface to fullscreen
  let playerSurfaceRef = createRef<HTMLDivElement>();

  async function manuallyLoadThumb() {
    let presto = await player.presto()
    let position = presto.getPosition();
    setThumbPosition(position)
  }

  // set options for the default track labeler
  player.trackLabelerOptions = {
    usePlayingRenditionInAbrLabel: true,
    useNativeLanguageNames: false,
    abrLabel: "Auto",
    disabledTrackLabel: "Off",
    unknownTrackLabel: "Unknown"
  } as DefaultTrackLabelerOptions

  // set a custom track labeler
  // player.trackLabeler = (track, player):string => { return '...'}


  let [customPlayer1, setCustomerPlayer1] = useState(new Player((pp:any) => {
    pp.use(clpp.dash.DashComponent);
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }));
  let customSurface1 = createRef<HTMLDivElement>();

  return (
    <div>
      <h1>Basic Overlay Theme</h1>
      <PlayerSurface player={player}
                     config={config.autoload ? config.config : null}
                     ref={playerSurfaceRef}
      >
        <BaseThemeOverlay
          player={player}
          startConfig={config.autoload ? undefined : config.config}
          posterUrl={config.poster}
          fullscreenRef={playerSurfaceRef}
          seekForward={10}
          seekBackward={-10}
          menuSelectionOptions={[
            {type: "audio", label: "Language", hideCurrentlyActive:false, hideWhenUnavailable: true},
            {type: "text", label: "Subtitles", hideCurrentlyActive:false, hideWhenUnavailable: true},
            {type: "video", label: "Video", hideCurrentlyActive:false, hideWhenUnavailable: true}
          ]}
        />
      </PlayerSurface>

      <div>
        <h2>Test Content</h2>
        <button onClick={() => {setConfig(CONFIG_1)}}>Config 1</button>
        <button onClick={() => {setConfig(CONFIG_2)}}>Config 2</button>
        <button onClick={() => {setConfig(CONFIG_3)}}>Config 3</button>
      </div>

      <h2>Custom Theme</h2>

      <PlayerSurface player={customPlayer1} config={CONFIG_1.config} style={{height: "320px"}}>
        <PlayerControls player={customPlayer1}>
          {/* We are creating a vertical bar to build our controls top to bottom */}
          <VerticalBar className={"pp-ui-transparent"}>
            {/* The first horizontal row shows some custom title for the content */}
            <HorizontalBar>
              <div>
                <div>
                  <Label label={"It is pretty here"} className={"pp-ui-label-title"}/>
                </div>
                <div>
                  <Label label={"really very pretty"} className={"pp-ui-label-subtitle"}/>
                </div>
              </div>
            </HorizontalBar>

            {/* We add a spacer to push the rest of the content to the bottom */}
            <Spacer/>

            {/* We create a horizontal bar for the thumbnails */}
            <HorizontalBar className={"pp-ui-transparent"}>
              <Thumbnail player={customPlayer1} listenToHover={true} moveRelativeToParent={true}/>
            </HorizontalBar>

            {/* The primary controls at the bottomg*/}
            <HorizontalBar>
              <PlayPauseButton player={customPlayer1} resetRate={true}/>
              <CurrentTime player={customPlayer1}/>
              <SeekBar player={customPlayer1} adjustWhileDragging={true} enableThumbnailSlider={false}/>
              <TimeLeft player={customPlayer1}/>
              <FullscreenButton fullscreenContainer={customSurface1} player={customPlayer1}/>
            </HorizontalBar>
          </VerticalBar>
        </PlayerControls>
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
  );
}
export default App;
