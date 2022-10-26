// @ts-ignore
import {clpp} from '@castlabs/prestoplay'
import {useEffect} from "react";

type Action = () => Promise<void>;

export class Player {
  private pp_: any = null;
  private actionQueue_: Action[] = []
  private actionQueueResolved?: () => void
  private actionQueuePromise: Promise<void>
  public hoverPosition = -1;

  constructor() {
    // noinspection JSIgnoredPromiseFromCall
    this.actionQueuePromise = new Promise<void>((resolve) => {
      this.actionQueueResolved = resolve
    })
  }

  init(element: HTMLVideoElement | string) {
    this.pp_ = new clpp.Player(element)
    // @ts-ignore
    window.player = this.pp_;
    for (let i = 0; i < this.actionQueue_.length; i++) {
      this.actionQueue_[i]()
    }
    this.actionQueue_ = []
    if (this.actionQueueResolved) {
      this.actionQueueResolved()
    }
    this.pp_.trigger({type: "initialized", detail:{}})
  }

  load(config: any) {
    this.action(() => {
      return this.pp_.load(config)
    })
  }

  on(event: string, callback: (e: any) => void) {
    this.action(() => {
      this.pp_.on(event, callback)
      return Promise.resolve()
    })
  }

  off(event: string, callback: (e: any) => void) {
    this.action(() => {
      this.pp_.off(event, callback)
      return Promise.resolve()
    })
  }

  one(event: string, callback: (e: any) => void) {
    this.action(() => {
      this.pp_.one(event, callback)
      return Promise.resolve()
    })
  }

  use(component: any) {
    this.action(() => {
      this.pp_.use(component)
      return Promise.resolve()
    })
  }

  setHoverPosition(position: number) {
    this.hoverPosition = position
    this.action(() => {
      this.pp_.trigger({
        type: "hoverposition",
        detail: {
          hoverPosition: position
        }
      })
      return Promise.resolve()
    })
  }

  async isPaused() {
    await this.actionQueuePromise
    return this.pp_.isPaused()
  }

  async presto() {
    await this.actionQueuePromise
    return this.pp_
  }

  private action(a: Action) {
    if (this.pp_) {
      a()
    } else {
      this.actionQueue_.push(a)
    }
  }
}

export type EventHandler = (e: any, presto: any) => void

export function usePrestoEvent(eventName: string, player: Player, handler: EventHandler) {
  async function handleEvent(e: any) {
    let presto = await player.presto()
    handler(e, presto)
  }

  useEffect(() => {
    player.on(eventName, handleEvent);
    return () => {
      player.off(eventName, handleEvent);
    }
  }, [player])
}
