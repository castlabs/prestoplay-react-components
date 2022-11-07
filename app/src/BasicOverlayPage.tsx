import {Asset} from "./Asset";
import PlayerSurface from "../../src/components/PlayerSurface";
import BaseThemeOverlay from "../../src/components/BaseThemeOverlay";
import React, {createRef, useState} from "react";
import {DefaultTrackLabelerOptions, Player} from "../../src";

// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import "@castlabs/prestoplay/cl.htmlcue"
import "@castlabs/prestoplay/cl.ttml"
import "@castlabs/prestoplay/cl.vtt"


export const BasicOverlayPage = (props: {
  asset?: Asset,
  autoload?: boolean
}) => {

  // Create the player as state of this component
  let [player, setPlayer] = useState(new Player((pp:any) => {
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

  // set options for the default track labeler
  player.trackLabelerOptions = {
    usePlayingRenditionInAbrLabel: true,
    useNativeLanguageNames: false,
    abrLabel: "Auto",
    disabledTrackLabel: "Off",
    unknownTrackLabel: "Unknown"
  } as DefaultTrackLabelerOptions


  return (
    <div>
      <PlayerSurface player={player}
                     config={props.autoload ? playerConfig : null}
                     ref={playerSurfaceRef}
      >
        <BaseThemeOverlay
          player={player}
          startConfig={props.autoload ? undefined : playerConfig}
          posterUrl={asset?.poster}
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

    </div>
  )
}
