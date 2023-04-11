# PRESTOplay React Components

This is a React Component library that provides components to interact with the PRESTOplay video player 
and build video player user interfaces and controls.

## Installation

The library can be installed from NPM:

```
npm i @castlabs/prestoplay-react-components@0.6.0-beta.9
```

Install peer dependencies:

```
npm i react@18 react-dom@18 @castlabs/prestoplay@6.2
```

## Details
Lib format: CJS

Language version: ES5

## Media Tailor integration

Use this example to render the player for the AWS Media Tailor demo:

```tsx
import React from "react";

import { MediaTailorPlayer } from '@castlabs/prestoplay-react-components'

import "@castlabs/prestoplay/clpp.styles.css"
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"

export const App = () => {
  return (
    <MediaTailorPlayer
      prestoConfig={{ license: "..." }} // Generated by someone at castLabs
      mediaTailorConfig={{ sessionUri: "..." }} // MediaTailor session URI
      autoplay
      mute
    />
  )
}
```

The full props for `MediaTailorPlayer` are:

```ts

type Props = {
  /**
   * PRESTOplay player configuration.
   */
  prestoConfig: {
    /**
     * License can be undefined for development purposes on localhost. Otherwise it is required.
     * A license can be obtained from castLabs for a specific domain.
     */
    license?: string
  },
  /**
   * MediaTailor session configuration.
   */
  mediaTailorConfig: {
    /**
     * MediaTailor session URI.
     */
    sessionUri: string,
    /**
     * adsParams for sessionUri request.
     */
    adsParams?: Record<string, any>,
    /**
     * Default is 3 seconds.
     */
    adPollingFrequencySeconds?: number,
    /**
     * Ad duration (assuming all ads have the same duration).
     */
    adDurationSeconds?: number,
  }
  /**
   * Poster image to display before video playback is requested.
   */
  poster?: string,
  /**
   * Autoplay the video immediately Note: that classic browser auto-play rules and limitations apply here.
   */
  autoplay?: boolean,
  /**
   * Start the player with muted volume. By default not muted.
   */
  mute?: boolean,
  /**
   * Enable video quality selection. By default disabled.
   */
  enableQualitySelection?: boolean,
  /**
   * When enabled, if multiple players are rendered, they will auto-sync to provide
   * smooth side-by-side playback of the same frames (same playback position/time).
   * By default enabled.
   */
  enableFleet?: boolean,
}
```

## Changelog

### 0.6.0-beta.10

Add `mediaTailorConfig.adDurationSeconds` prop to `MediaTailorPlayer` component.

### 0.6.0-beta.9

Add `MediaTailorPlayer` component.
