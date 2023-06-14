import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { FullscreenButton } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof FullscreenButton> = {
  title: 'components/Fullscreen Button',
  component: FullscreenButton,
  parameters: {
    docs: {
      source: {
        code: `
import { FullscreenButton } from '@castlabs/prestoplay-react-components'

return (
  <FullscreenButton />
)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof FullscreenButton>

export const Primary: Story = {
  argTypes: {
    useVideoElementForFullscreen: {
      table: { defaultValue: { summary: '[\'iOS\']' } },
    },
  },
}
