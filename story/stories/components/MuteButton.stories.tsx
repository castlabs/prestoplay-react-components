import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { MuteButton } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof MuteButton> = {
  title: 'components/Mute Button',
  component: MuteButton,
  parameters: {
    docs: {
      source: {
        code: `
import { MuteButton } from '@castlabs/prestoplay-react-components'

return (
  <MuteButton />
)
`,
      },
    },
  },
  argTypes: {
    muted: {
      table: {
        disable: true,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof MuteButton>

export const Primary: Story = {
  args: {
    muted: false,
  },
}

export const Secondary: Story = {
  args: {
    muted: true,
  },
}
