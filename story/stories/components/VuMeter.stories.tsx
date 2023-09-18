import React, { useMemo, useState } from 'react'
import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'

import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'

import { BaseThemeOverlay, Player, PlayerSurface, PrestoContext, PrestoContextType, VuMeter } from '../../../src'
import { TEST_ASSETS } from '../Asset'

import type { Meta, StoryObj } from '@storybook/react'


const Component =  () => {
  const [context, setContext] = useState<PrestoContextType|null>(null)

  const player = useMemo(() => {
    return new Player(pp => {
      pp.use(clpp.dash.DashComponent)
      pp.use(clpp.hls.HlsComponent)
      pp.use(clpp.htmlcue.HtmlCueComponent)
      pp.use(clpp.ttml.TtmlComponent)
      pp.use(clpp.vtt.VttComponent)
    })
  }, [])

  const playerConfig = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    source: TEST_ASSETS[0].config.source ?? '',
  }

  return (
    <div style={{ display: 'flex' }}>
      <PlayerSurface
        player={player}
        baseConfig={{}}
        config={playerConfig}
        autoload={true}
        playsInline={true}
        style={{ resize: 'both', overflow: 'auto', width: 600, height: 340 }}
        onContext={setContext}
      >
        <BaseThemeOverlay/>
      </PlayerSurface>
      {context && (
        <PrestoContext.Provider value={context}>
          <VuMeter width={140} height={320} config={{ fontSize: 16 }} style={{ marginLeft: 20 }} />
        </PrestoContext.Provider>
      )}
    </div>
  )
}

const meta: Meta<typeof VuMeter> = {
  title: 'components/VU Meter',
  component: Component,
  parameters: {
    docs: {
      source: {
        code: `
import { VuMeter } from '@castlabs/prestoplay-react-components'

return (
  <VuMeter />
)
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof VuMeter>

export const Primary: Story = {}
