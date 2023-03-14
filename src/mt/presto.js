import { clpp } from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import "@castlabs/prestoplay/cl.hls"
import "@castlabs/prestoplay/cl.vtt"
import "@castlabs/prestoplay/cl.htmlcue"

// For HLS playback
// @ts-ignore
import * as mux from 'mux.js'
// @ts-ignore
window.muxjs = mux.default

/**
 * Configure PRESTOPlay playback components
 */
export const configurePrestoComponents = (prestoPlayer) => {
  prestoPlayer.use(clpp.dash.DashComponent)
  prestoPlayer.use(clpp.hls.HlsComponent)
  prestoPlayer.use(clpp.vtt.VttComponent)
  prestoPlayer.use(clpp.htmlcue.HtmlCueComponent)
}
