import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { HorizontalBar, HorizontalBarStory } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof HorizontalBar> = {
  title: 'components/Horizontal Bar',
  component: HorizontalBarStory,
  parameters: {
    docs: {
      source: {
        code: `
import { HorizontalBar } from '@castlabs/prestoplay-react-components'

return (
  <HorizontalBar>
    ...
  </HorizontalBar>
)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof HorizontalBar>

export const Primary: Story = {
}
