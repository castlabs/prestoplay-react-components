import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { TimeLeft } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof TimeLeft> = {
  title: 'components/Time Left',
  component: TimeLeft,
}

export default meta

type Story = StoryObj<typeof TimeLeft>

export const Primary: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import { TimeLeft } from '@castlabs/prestoplay-react-components'

return (
  <TimeLeft />
)
`,
      },
    },
  },
}
