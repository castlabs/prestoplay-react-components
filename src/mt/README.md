# MediaTailor Integration Demo
POC of PRESTOPlay integration with Media Tailor non-linear advertising with Innovid ads.

## Installation

Install along with peer dependencies.

```sh
npm i react react-dom @castlabs/prestoplay @castlabs/prestoplay-react-components
```

## Usage

```tsx
import React from "react"
import { MediaTailorPlayer } from '@castlabs/prestoplay-react-components'
import "@castlabs/prestoplay/clpp.styles.css"
import "@castlabs/prestoplay-react-components/dist/themes/pp-ui-base-theme-embedded.css"
import poster from '../assets/poster.png'

export const Page = () => {
  return (
    <MediaTailorPlayer
      poster={poster}
      config={{ license: "..." }} // Generated by someone at castLabs
      mediaTailorAsset={{ sessionUri: "..." }}
    />
  )
}
```

## Debugging
All relevant log messages start with prefix `MTDemo`. Use that to filter DevTools logs.


## Sources
- [Ticket](https://castlabs.atlassian.net/browse/DE-6364)
- [Media tailor docs](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-reporting-client-side.html)
- [Innovid docs](https://github.com/castlabs/innovid-ctv-html-integration)