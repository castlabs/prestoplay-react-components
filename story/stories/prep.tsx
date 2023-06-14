/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { clpp } from '@castlabs/prestoplay'
import '@castlabs/prestoplay/cl.dash'
import '@castlabs/prestoplay/cl.hls'
import '@castlabs/prestoplay/cl.htmlcue'
import '@castlabs/prestoplay/cl.ttml'
import '@castlabs/prestoplay/cl.vtt'
import '@castlabs/prestoplay/cl.thumbnails'
import React, { useEffect, useState } from 'react'

import { Player, PrestoContext, PrestoContextType } from '../../src'

let initPromise: Promise<PrestoContextType> | null = null

const init = async (): Promise<PrestoContextType> => {
  if (initPromise) { return initPromise}

  initPromise = init_().then(context => {
    console.info('useStoryContext: Presto context initialized')
    return context
  })
  
  return initPromise
}

const init_ = async (): Promise<PrestoContextType> => {
  const video = document.createElement('video')
  const playerSurface = document.createElement('div')
  playerSurface.appendChild(video)
  const player = new Player()

  await player.init(video)

  const presto = await player.presto()

  presto.use(clpp.dash.DashComponent)
  presto.use(clpp.hls.HlsComponent)
  presto.use(clpp.htmlcue.HtmlCueComponent)
  presto.use(clpp.ttml.TtmlComponent)
  presto.use(clpp.vtt.VttComponent)

  return {
    playerSurface, presto, player,
  }
}

const useStoryContext = () => {
  const [context, setContext] = useState<PrestoContextType|null>(null)

  useEffect(() => {
    init()
      .then(setContext)
      .catch((error) => {
        console.error('useStoryContext: Failed to initialize Presto context', error)
      })
  }, [])

  return context
}

export const StoryProvider = (props: { children: React.ReactNode }) => {
  const context = useStoryContext()

  if (!context) {
    return null
  }

  return (
    <PrestoContext.Provider value={context}>
      {props.children}
    </PrestoContext.Provider>
  )
}

export const PrestoContextDecorator = (Story) => {
  return (
    <StoryProvider>
      <Story/>
    </StoryProvider>
  )
}
