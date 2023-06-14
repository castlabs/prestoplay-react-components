import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { RateButton } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof RateButton> = {
  title: 'components/Rate Button',
  component: RateButton,
  parameters: {
    docs: {
      source: {
        code: `
import { RateButton } from '@castlabs/prestoplay-react-components'

return (
  <RateButton />
)
`,
      },
    },
  },
  argTypes: {
    factor: {
      table: { defaultValue: { summary: 2 } },
    },
    min: {
      table: { defaultValue: { summary: 0.5 } },
    },
    max: {
      table: { defaultValue: { summary: 64 } },
    },
  },
}

export default meta

type Story = StoryObj<typeof RateButton>

export const Primary: Story = {
  args: {
    factor: 2,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { RateButton } from '@castlabs/prestoplay-react-components'

return (
  <RateButton factor={2} />
)
`,
      },
    },
  },
}

export const Secondary: Story = {
  args: {
    factor: 0.5,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { RateButton } from '@castlabs/prestoplay-react-components'

return (
  <RateButton factor={0.5} />
)
`,
      },
    },
  },
}
