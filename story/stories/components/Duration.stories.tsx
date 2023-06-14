import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { Duration } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Duration> = {
  title: 'components/Duration',
  component: Duration,
  parameters: {
    docs: {
      source: {
        code: `
import { Duration } from '@castlabs/prestoplay-react-components'

return (
  <Duration />
)
        `,
      },
    },
  },
  argTypes: {
    seconds: {
      table: {
        disable: true,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Duration>

export const Primary: Story = {
  args: {
  },
}

export const Secondary: Story = {
  args: {
    seconds: 88,
  },
}

export const Third: Story = {
  args: {
    seconds: 80088,
  },
}
