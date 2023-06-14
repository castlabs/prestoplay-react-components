import { clpp } from '@castlabs/prestoplay'
import React from 'react'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { PlayerSurfaceForStory } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PlayerSurfaceForStory> = {
  title: 'components/Player Surface',
  component: PlayerSurfaceForStory,
  parameters: {
    docs: {
      source: {
        code: `
import { PlayerSurface, Player } from '@castlabs/prestoplay-react-components'

const player = new Player()
...

return (
  <PlayerSurface
    player={player}
    baseConfig={{
      license: '...',
    }}
    config={{
      source: '...',
      autoplay: false,
      muted: true,
    }}
    autoload
  >
    ...
  </PlayerSurface>
)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof PlayerSurfaceForStory>

export const Primary: Story = {
}
