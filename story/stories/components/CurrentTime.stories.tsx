import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { CurrentTime } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CurrentTime> = {
  title: 'components/Current Time',
  component: CurrentTime,
  parameters: {
    docs: {
      source: {
        code: `
import { CurrentTime } from '@castlabs/prestoplay-react-components'

return (
  <CurrentTime />
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

type Story = StoryObj<typeof CurrentTime>

export const Primary: Story = {
  args: {
    seconds: 342,
  },
}

export const Secondary: Story = {
  args: {
    seconds: 7342,
  },
}
