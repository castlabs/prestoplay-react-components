/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render, act } from '@testing-library/react'
import React from 'react'
import RTRenderer from 'react-test-renderer'

import { EventType, UIEvents } from '../src'
import { PrestoContext } from '../src/context/PrestoContext'
import { Player } from '../src/Player'

export function emitPlayerEvent<K extends EventType<UIEvents>>(player: Player, type: K, data: UIEvents[K]): void {
  player.emitUIEvent(type, data)
}


type TestContextProps = {
  children?: React.ReactNode
} 

/**
 * Presto context for testing purposes
 */
export const createContextProvider = () => {
  const player = new Player()

  const Context = (props: TestContextProps) => {  
    return (
      <PrestoContext.Provider value={{
        player,
        // @ts-ignore
        presto: null,
        // @ts-ignore
        playerSurface: null,
      }}>
        {props.children}
      </PrestoContext.Provider>
    )
  }

  return {
    player,
    render: (children: React.ReactNode) => render(<Context>{children}</Context>),
    Context,
    emitPlayerEvent: <K extends EventType<UIEvents>>(type: K, data: UIEvents[K]) => {
      // Act does not have to be awaited
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        emitPlayerEvent(player, type, data)
      })
    },
  }
}

/**
 * Expect that the rendered HTML did not change
 */
export const expectMatchesSnapshot = (children: React.ReactNode) => {
  const context = createContextProvider()

  const json = RTRenderer.create(
    <context.Context>
      {children}
    </context.Context>,
  ).toJSON()

  expect(json).toMatchSnapshot()
}
