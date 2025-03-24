import { Player } from '../../src'

import { Asset } from './Asset'

export type PageProps = {
  player: Player
  asset?: Asset
  autoload?: boolean
}

