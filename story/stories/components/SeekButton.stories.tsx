import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { SeekButton } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof SeekButton> = {
  title: 'components/Seek Button',
  component: SeekButton,
}

export default meta

type Story = StoryObj<typeof SeekButton>

export const Primary: Story = {
  args: {
    seconds: 5,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { SeekButton } from '@castlabs/prestoplay-react-components'

return (
  <SeekButton seconds={5} />
)
`,
      },
    },
  },
}

export const Secondary: Story = {
  args: {
    seconds: -5,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { SeekButton } from '@castlabs/prestoplay-react-components'

return (
  <SeekButton seconds={-5} />
)
`,
      },
    },
  },
}
