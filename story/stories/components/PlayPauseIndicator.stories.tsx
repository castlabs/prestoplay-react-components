import React, { useState } from 'react'
import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { PlayPauseIndicator } from '../../../src'

import type { Meta, StoryObj } from '@storybook/react'

const Component =  () => {
  const [isPlaying, setPlaying] = useState(true)
  return (
    <div style={{ width: 100, height: 100 }}>
      <PlayPauseIndicator isPlaying={isPlaying}/>
      <button onClick={() => setPlaying(true)}>play</button>
      <button onClick={() => setPlaying(false)}>pause</button>
    </div>
  )
}

const meta: Meta<typeof PlayPauseIndicator> = {
  title: 'components/PlayPause Indicator',
  component: Component,
  parameters: {
    docs: {
      source: {
        code: `
import { PlayPauseIndicator } from '@castlabs/prestoplay-react-components'

return (
  <PlayPauseIndicator />
)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof PlayPauseIndicator>

export const Primary: Story = {

}
