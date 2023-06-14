import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { BufferingIndicator } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof BufferingIndicator> = {
  title: 'components/Buffering Indicator',
  component: BufferingIndicator,
  parameters: {
    docs: {
      source: {
        code: `
import { BufferingIndicator } from '@castlabs/prestoplay-react-components'

return (
  <BufferingIndicator />
)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof BufferingIndicator>

export const Primary: Story = {
  args: {
    visible: true,
  },
}
