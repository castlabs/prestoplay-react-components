import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { PlayerControls } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PlayerControls> = {
  title: 'components/Player Controls',
  component: PlayerControls,
  parameters: {
    docs: {
      source: {
        code: `
import { PlayerControls } from '@castlabs/prestoplay-react-components'

return (
  <PlayerControls>
    ...
  </PlayerControls>
)
`,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof PlayerControls>

export const Primary: Story = {
  argTypes: {
    hideDelay: {
      table: { defaultValue: { summary: 3000 } },
    },
    mode: {
      table: { defaultValue: { summary: 'auto' } },
    },
  },
}
