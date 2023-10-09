import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { VerticalBar, VerticalBarStory } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof VerticalBar> = {
  title: 'components/Vertical Bar',
  component: VerticalBarStory,
}

export default meta

type Story = StoryObj<typeof VerticalBar>

export const Primary: Story = {
  parameters: {
    docs: {
      source: {
        code: `
import { VerticalBar } from '@castlabs/prestoplay-react-components'

return (
  <VerticalBar>
    ...
  </VerticalBar>
)
`,
      },
    },
  },
}
