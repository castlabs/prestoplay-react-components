# PRESTOplay React Components (Beta)

This is a React xxxComponent library that provides components to build user interfaces for PRESTOplay video player.

⚠️ *Currently this is in Beta version (0.x.x), therefore be aware that breaking changes may occur between minor releases. The versions will switch to standard semantic versioning once version 1.0.0 is released.* ⚠️

## Installation

The library can be installed as a dependency from NPM:

```sh
npm i @castlabs/prestoplay-react-components
```

Please note that you should also install the peer dependencies, i.e. `react`, `react-dom` and 
`@castlabs/prestoplay`:

```sh
npm i react@18 react-dom@18 @castlabs/prestoplay@6.2
```

## Getting started

### Render a basic video element

Use the `PlayerSurface` component to render a basic player surface that will load and play the provided video without
any UI controls.

```jsx
import React, { useState } from 'react'
// Load the prestoplay modules that are needed for the project
import { clpp } from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import "@castlabs/prestoplay/cl.thumbnails"
import "@castlabs/prestoplay/cl.htmlcue"
import "@castlabs/prestoplay/cl.ttml"
import "@castlabs/prestoplay/cl.vtt"
import { Player, PlayerSurface } from "@castlabs/prestoplay-react-components/"

// Load CSS for PRESTOplay
import "@castlabs/prestoplay/clpp.styles.css"
// Load CSS for PRESTOplay React
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"

const baseConfig = {
  license: "...",
}

const App = () => {
  const [player] = useState(new Player((pp) => {
    // pp is an instance of clpp.Player from @castlabs/prestoplay
    pp.use(clpp.dash.DashComponent);
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }))

  const [loadConfig, setLoadConfig] = useState<any>({
    source: "https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd",
    autoplay: true,
    muted: true
  })

  return (
    <PlayerSurface
      player={player}
      baseConfig={baseConfig}
      config={loadConfig}
      autoload/>
  )
}
```

### Render video with UI controls

Use the `BaseThemeOverlay` component to get started with a set of basic UI controls. It serves as a small, 
basic implementation of a UI theme.

```jsx
import React, { useState } from 'react'
// Load the prestoplay modules that are needed for the project
import { clpp } from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"
import "@castlabs/prestoplay/cl.thumbnails"
import "@castlabs/prestoplay/cl.htmlcue"
import "@castlabs/prestoplay/cl.ttml"
import "@castlabs/prestoplay/cl.vtt"
import { Player, PlayerSurface, BaseThemeOverlay } from "@castlabs/prestoplay-react-components/"

// Load CSS for PRESTOplay
import "@castlabs/prestoplay/clpp.styles.css"
// Load CSS for PRESTOplay React
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"

const baseConfig = {
  license: "...",
}

const App = () => {
  const [player] = useState(new Player((pp) => {
    // pp is an instance of clpp.Player from @castlabs/prestoplay
    pp.use(clpp.dash.DashComponent);
    pp.use(clpp.htmlcue.HtmlCueComponent)
    pp.use(clpp.ttml.TtmlComponent)
    pp.use(clpp.vtt.VttComponent)
  }))

  const [loadConfig, setLoadConfig] = useState<any>({
    source: "https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd",
    autoplay: true,
    muted: true
  })

  return (
    <PlayerSurface
      player={player}
      baseConfig={baseConfig}
      config={loadConfig}
      autoload>
        <BaseThemeOverlay/>
    </PlayerSurface>
  )
}
```

## Building a custom UI

⚠️ ***Coming soon**: This section is under construction. More examples and documentation is coming soon.* ⚠️

Use individual UI components from `@castlabs/prestoplay-react-components` to build a customized UI.

- [UI Components](https://github.com/castlabs/prestoplay-react-components/tree/main/src/components)
- [Examples of customized UI](https://github.com/castlabs/prestoplay-react-components/tree/main/app/src)

## Changelog
- [Changelog](https://github.com/castlabs/prestoplay-react-components/blob/main/CHANGELOG.md)
