export const SOURCE_DEFAULT_SKIN = `
import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import { Player, BaseThemeOverlay, PlayerSurface } from '@castlabs/prestoplay-react-components'
import React from 'react'

import '@castlabs/prestoplay/clpp.styles.css'
import '@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css'

const baseConfig = {
  // For production uncomment this and insert your license key
  // (for local development a license is not required)
  // license: '',
}

const player = new Player(pp => {
  pp.use(clpp.dash.DashComponent)
  pp.use(clpp.hls.HlsComponent)
  pp.use(clpp.htmlcue.HtmlCueComponent)
  pp.use(clpp.ttml.TtmlComponent)
  pp.use(clpp.vtt.VttComponent)
})

const sourceConfig = {
  source: 'https://c.../manifest.mpd',
}

const App = () => {
  return (
    <PlayerSurface
      player={player}
      baseConfig={baseConfig}
      config={sourceConfig}
    >
      <BaseThemeOverlay />
    </PlayerSurface>
  )
}
`
