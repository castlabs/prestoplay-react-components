import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { RateText } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof RateText> = {
  title: 'components/Rate Text',
  component: RateText,
  parameters: {
    docs: {
      source: {
        code: `
import { RateText } from '@castlabs/prestoplay-react-components'

return (
  <RateText />
)
`,
      },
    },
  },
  argTypes: {
    rate: {
      table: {
        disable: true,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof RateText>

export const Primary: Story = {
}

export const Secondary: Story = {
  args: {
    rate: 2,
  },
}

export const Third: Story = {
  args: {
    rate: 0.5,
  },
}
