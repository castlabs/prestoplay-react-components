import {ReactTestRenderer} from "react-test-renderer";
import {EventType, UIEvents} from "../src";
import Player from "../src/Player";

export function classNames(component?: ReactTestRenderer) {
  // @ts-ignore
  return component!.toJSON().props!.className
}

export function emitPlayerEvent<K extends EventType<UIEvents>>(player: Player, type: K, data: UIEvents[K]): void {
  // @ts-ignore
  player.emitUIEvent(type, data)
}

