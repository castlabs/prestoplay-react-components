import { ReactTestRenderer } from 'react-test-renderer'

import { EventType, UIEvents } from '../src'
import { Player } from '../src/Player'


export function classNames(component?: ReactTestRenderer): string {
  let json = component?.toJSON()
  if (!json) {return ''}
  if (Array.isArray(json)) {json = json[0]}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return json.props.className ?? ''
}

export function emitPlayerEvent<K extends EventType<UIEvents>>(player: Player, type: K, data: UIEvents[K]): void {
  player.emitUIEvent(type, data)
}

