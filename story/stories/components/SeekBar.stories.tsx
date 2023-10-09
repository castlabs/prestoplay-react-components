import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { SeekBar } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof SeekBar> = {
  title: 'components/Seek Bar',
  component: SeekBar,
  parameters: {
    docs: {
      source: {
        code: `
import { SeekBar } from '@castlabs/prestoplay-react-components'

return (
  <SeekBar />
)
`,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof SeekBar>

export const Primary: Story = {
}
