/**
 * Base type for the interface that defines the events
 */
type EventMap = Record<string, any>

/**
 * The event key needs to be a string and a key of the event map
 */
export type EventType<T extends EventMap> = string & keyof T
/**
 * The event listener
 */
export type EventListener<T> = (data: T) => void

/**
 * Generic event emitter
 */
interface IEventEmitter<T extends EventMap> {
  on<K extends EventType<T>>(type: K, listener: EventListener<T[K]>): void
  off<K extends EventType<T>>(type: K, listener: EventListener<T[K]>): void
  one<K extends EventType<T>>(type: K, listener: EventListener<T[K]>): void
  emit<K extends EventType<T>>(type: K, data: T[K]): void
}

/**
 * Basic implementation of an event emitter
 */
export class EventEmitter<T extends EventMap> implements IEventEmitter<T> {
  private listeners_: { [K in keyof EventMap]?: Array<(p: EventMap[K]) => void> } = {}

  emit<K extends EventType<T>>(type: K, data: T[K]): void {
    (this.listeners_[type] || []).forEach(function(fn) {
      fn.call(null, data)
    })
  }

  off<K extends EventType<T>>(type: K, listener: EventListener<T[K]>): void {
    this.listeners_[type] = (this.listeners_[type] || []).filter(f => f !== listener)
  }

  on<K extends EventType<T>>(type: K, listener: EventListener<T[K]>): void {
    this.listeners_[type] = (this.listeners_[type] || []).concat(listener)
  }

  one<K extends EventType<T>>(type: K, listener: EventListener<T[K]>): void {
    const oneoff = (d: any)=> {
      listener.call(null, d)
      this.off(type, oneoff)
    }
    this.listeners_[type] = (this.listeners_[type] || []).concat(oneoff)
  }
}
