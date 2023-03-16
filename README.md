# PRESTOplay React Components

This is a React Component library that provides components to interact with the PRESTOplay video player 
and build video player user interfaces and controls.

## Installation

The library can be installed from NPM:

```
npm i @castlabs/prestoplay-react-components@0.6.0-beta.5
```

Install peer dependencies:

```
npm i react@18 react-dom@18 @castlabs/prestoplay@6.2
```

## Media Tailor integration

Use this example to render the player for the AWS Media Tailor demo.

```jsx
import React from "react";

import { MediaTailorPlayer } from '@castlabs/prestoplay-react-components'
import poster from '../assets/poster.png' // Create this asset first

import "@castlabs/prestoplay/clpp.styles.css"
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"

export const App = () => {
  return (
    <MediaTailorPlayer
      poster={poster}
      prestoConfig={{ license: "..." }} // Generated by someone at castLabs
      mediaTailorConfig={{ sessionUri: "..." }} // MediaTailor session URI
    />
  )
}
```
