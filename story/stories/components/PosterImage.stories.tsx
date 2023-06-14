import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { PosterImage } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof PosterImage> = {
  title: 'components/Poster Image',
  component: PosterImage,
  parameters: {
    docs: {
      source: {
        code: `
import { PosterImage } from '@castlabs/prestoplay-react-components'

return (
  <PosterImage src="https://cl-player-content.s3.amazonaws.com/340p-maldives.jpg" />
)
`,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof PosterImage>

export const Primary: Story = {
  args: {
    src: 'https://cl-player-content.s3.amazonaws.com/340p-maldives.jpg',
    style: {
      width: 400,
      height: 150,
      position: 'relative',
    },
  },
}
