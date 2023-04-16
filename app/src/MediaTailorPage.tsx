import React from "react";
import { MediaTailorPlayer } from '../../src/mt/MediaTailorPlayer'
// @ts-ignore
import poster from '../assets/poster.png'

import "@castlabs/prestoplay/clpp.styles.css"
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"
import "./mt.css"

export const MediaTailorPage = () => {
  return (
    <div>
        <MediaTailorPlayer
          poster={poster}
          prestoConfig={{ license: undefined }}
          mediaTailorConfig={{
            sessionUri: "https://d285l0o0snebba.cloudfront.net/v1/session/0d316d81ecd380e53d05ae3167f300cd2aebaf09/CaDemoCdkBackendPlaybackConfigVWhxF/v1/channel/Rv3n27/index.m3u8",
            adPollingFrequencySeconds: 5,
            adDurationSeconds: 5,
            adsParams: { device: "head_of_house_hold" }
          }}
          mute
          enableFleet={false}
        />
        <MediaTailorPlayer
          poster={poster}
          prestoConfig={{ license: undefined }}
          mediaTailorConfig={{
            sessionUri: "https://d285l0o0snebba.cloudfront.net/v1/session/0d316d81ecd380e53d05ae3167f300cd2aebaf09/CaDemoCdkBackendPlaybackConfigVWhxF/v1/channel/Rv3n27/index.m3u8",
            adPollingFrequencySeconds: 5,
            adDurationSeconds: 5,
            adsParams: { device: "head_of_house_hold" }
          }}
          mute
          enableQualitySelection
          enableFleet={false}
        />
    </div>
  )
}
