import { clpp } from '@castlabs/prestoplay'
import React, { useState }  from 'react'

import { InterstitialPlayer } from '../../src'

/**
 * A page featuring the HLS interstitial player.
 */
export const InterstitialPage = () => {
  const [mounted, setMounted] = useState(true)

  const toggleMounted = () => {
    setMounted(m => !m)
  }

  return (
    <main className="in-page">
      <div className="in-container">
        <div>
          <button onClick={toggleMounted}>Toggle mounted</button>
        </div>
        {mounted ? (
          <div className="in-video-container">
            <InterstitialPlayer
              asset={{
                source: {
                  // url: 'http://localhost:3000/vod-fixed.m3u8',
                  url: 'http://localhost:3000/vod-preroll.m3u8',
                  // url: 'https://9457688946fc45ac9a3b526e93b06bf7.us-west-2.alpha.mediatailor.aws.a2z.com/v1/master/5d22c610440c419b9290f9233dc99fe61adb77ab/mt-dev-vod/index.m3u8?aws.insertionMode=GUIDED',
                  type: clpp.Type.HLS,
                },
              }}
              // Possibly it's something wrong with the AIP stream http://localhost:3000/vod-preroll.m3u8
              // but unfortunately what happens is that we get state "Ended" and then the video
              // continues playing for another cca 800ms. This would obviously cause a glitch
              // in the UI so configure the player to ignore all ended states changes
              patchIgnoreStateEnded={true}
              hasTopControlsBar={false}
              interstitialOptions={{
              // Start resolving X-ASSET-LIST 15 seconds or less before
              // the cue is scheduled
                resolutionOffsetSec: 15,
              }}
              renderTopCompanion={(isFullScreen) => {
                if (!isFullScreen) {return null}
                return <div className="in-logo-container"><img className="in-logo" src="./logo.png"/></div>
              }}
              interstitialControls={{
                pause: true,
                seekButtons: false,
                time: false,
                fullScreen: true,
                audio: false,
              }}
            // onPlayerChanged={p => {
            //   // @ts-ignore
            //   window.player = p
            // }}
            // showInterstitialMarkers={false}
            // seekStep={2}
            // controlsVisibility='never'
            // intermissionDuration={5}
            // interstitialLabel={(i) => `Ad ${i.podOrder} of ${i.podCount}`}
            // renderInterstitialLabel={(i) => null}
            // renderIntermission={(seconds) => <div>{seconds}</div>}
            // loop={false}
            // onEnded={() => {}}
            // onLoopEnded={() => {}}
            />
          </div>
        ): null}
      </div>
    </main>
  )
}
