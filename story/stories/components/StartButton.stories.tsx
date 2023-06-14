import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { StartButton } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof StartButton> = {
  title: 'components/Start Button',
  component: StartButton,
}

export default meta

type Story = StoryObj<typeof StartButton>

export const Primary: Story = {
  args: {
    style: {
      position: 'relative',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
import { StartButton } from '@castlabs/prestoplay-react-components'

return (
  <StartButton />
)
`,
      },
    },
  },
}
