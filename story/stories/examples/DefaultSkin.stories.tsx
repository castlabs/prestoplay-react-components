import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.mse'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import React, { useMemo } from 'react'

import { DefaultTrackLabelerOptions, Player, BaseThemeOverlay, PlayerSurface, BaseThemeOverlayProps } from '../../../src'
import { TEST_ASSETS } from '../Asset'

import '@castlabs/prestoplay/clpp.styles.css'
import '../../../src/themes/pp-ui-base-theme.css'


import type { Meta, StoryObj } from '@storybook/react'


type Props = BaseThemeOverlayProps & {
  autoload?: boolean
}

const DefaultSkin = (props: Props) => {
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
    source: TEST_ASSETS[0].config.source ?? '',
  }

  // set options for the default track labeler
  player.trackLabelerOptions = {
    usePlayingRenditionInAbrLabel: true,
    useNativeLanguageNames: false,
    abrLabel: 'Auto',
    disabledTrackLabel: 'Off',
    unknownTrackLabel: 'Unknown',
  } as DefaultTrackLabelerOptions

  return (
    <PlayerSurface
      player={player}
      baseConfig={{}}
      config={playerConfig}
      autoload={true}
      playsInline={true}
      style={{ resize: 'both', overflow: 'auto', width: 900, height: 340 }}
    >
      <BaseThemeOverlay
        {...props}
      />
    </PlayerSurface>
  )
}

const meta: Meta<typeof DefaultSkin> = {
  title: 'examples/Default Skin',
  component: DefaultSkin,
}

export default meta

type Story = StoryObj<typeof DefaultSkin>

export const Primary: Story = {
  args: {
    // posterUrl: 'https://cl-player-content.s3.amazonaws.com/340p-maldives.jpg',
    // startButton: true,
    seekForward: 10,
    seekBackward: -10,
    autoload: false,
  },
}
