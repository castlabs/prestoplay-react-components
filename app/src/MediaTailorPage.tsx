import React from "react";
import { MediaTailorPlayer } from '../../src/mt/MediaTailorPlayer'
// @ts-ignore
import poster from '../assets/poster.png'

// TODO into manual
import "@castlabs/prestoplay/clpp.styles.css"
// TODO into manual
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"


export const MediaTailorPage = () => {
  return (
    <MediaTailorPlayer
      poster={poster}
      config={{ license: undefined }}
      mediaTailorAsset={{ sessionUri: "https://ea79f0b35bb24fc99b4961286dc218a0.mediatailor.us-west-2.amazonaws.com/v1/session/94063eadf7d8c56e9e2edd84fdf897826a70d0df/client-side-overlays-nab/hls.m3u8" }}
    />
  )
}
