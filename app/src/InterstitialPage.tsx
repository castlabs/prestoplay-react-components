import { clpp } from '@castlabs/prestoplay'
import React, { useState }  from 'react'

import { InterstitialPlayer } from '../../src'

/**
 * A page featuring the HLS interstitial player.
 */
export const InterstitialPage = () => {
  const [mounted, setMounted] = useState(false)

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
              enableFocus={false}
              asset={{
                source: {
                  url: 'https://content.players.castlabs.com/api-interstitials-v3/vod-fixed.m3u8',
                  // url: 'https://content.players.castlabs.com/api-interstitials-v3/vod-preroll.m3u8',
                  type: clpp.Type.HLS,
                },
                autoplay: true,
              }}
              hasStartButton={false}
              intermissionDuration={null}
              hasTopControlsBar={false}
              interstitialOptions={{
                config: {
                  // license: '',
                },
                // Start resolving X-ASSET-LIST 15 seconds or less before
                // the cue is scheduled
                resolutionOffsetSec: 15,
                interstitialAssetConverter: (asset: clpp.interstitial.PlayerItem) => {
                  asset.config.htmlcue = {
                    enableResizeObserver: false,
                  }
                  return asset
                },
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
              onIntermissionEnded={() => {
                console.info('EEEEvent: intermission-ended playback or primary or preroll started')
              }}
              onHlsiPlayerReady={hp => {
                hp.on('cues-changed', (event) => {
                  const cues = hp.getCues()
                  console.info('EEEEvent: cues-changed', event.detail, 'cues via api call', cues)
                })

                hp.on('interstitial-started', (event) => {
                  console.info('EEEEvent: interstitial-started', event.detail)
                })

                hp.on('interstitial-item-started', (event) => {
                  // There are multiple items in one interstitial
                  console.info('EEEEvent: interstitial-item-started', event.detail)
                })

                hp.on('interstitial-ended', (event) => {
                  console.info('EEEEvent: interstitial-ended', event.detail)
                })

                hp.on('primary-started', (event) => {
                  console.info('EEEEvent: primary-started', event.detail)
                })

                hp.on('playback-started', (event) => {
                  console.info('EEEEvent: playback-started (primary or preroll)', event.detail)
                })

                hp.on('primary-ended', (event) => {
                  console.info('EEEEvent: primary-ended', event.detail)
                })
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
