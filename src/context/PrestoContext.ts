/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext } from 'react'

import { Player } from '../Player'

export type PrestoContextType = {
  playerSurface: HTMLDivElement
  player: Player
}

/**
 * Main context for our React components.
 */
export const PrestoContext = createContext<PrestoContextType>({
  // @ts-ignore All the values here will be defined when the context is instantiated.
  // But I have to specify some default values here anyway, so I'm setting all to null.
  playerSurface: null,
  // @ts-ignore
  player: null,
})
