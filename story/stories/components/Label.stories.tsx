import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { Label } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Label> = {
  title: 'components/Label',
  component: Label,
  parameters: {
    docs: {
      source: {
        code: `
import { Label } from '@castlabs/prestoplay-react-components'

return (
  <Label label="Sample text" />
)
`,
      },
    },
  },
  argTypes: {
    testId: {
      table: {
        disable: true,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const Primary: Story = {
  args: {
    label: 'Sample text',
  },
}
