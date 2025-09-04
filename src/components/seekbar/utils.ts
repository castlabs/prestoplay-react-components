import { clpp } from '@castlabs/prestoplay'

import { Callback, Cue, SeekRange } from './types'

/**
 * Convert position inside of a range to percentage, starting at 0%
 * at the start of the range and going up to 100% at the end of the range.
 *
 * @example
 * positionToPercent(10, { start: 0, end: 50 })
 * // returns 20
 */
export function positionToPercent(position: number, range: SeekRange): number {
  const { start, end } = range
  return (position - start) / (end - start) * 100
}

/**
 * Get the horizontal position where a mouse click occurred in terms
 * of percentage in side of a target element.
 *
 * @example
 * const percent = mousePercentX(event, element)
 *
 * @example
 * const percent = mousePercentX(event)
 */
export function mousePercentX (event: MouseEvent, target?: HTMLElement): number {
  const el = (target ?? event.target) as HTMLElement
  const rect = el.getBoundingClientRect()
  const relativeX = event.clientX - rect.left
  return (relativeX / rect.width) * 100
}

/**
 * Get player position as percentage of the seek range.
 */
export function playerPositionPercent(player: clpp.Player): number {
  const range = player.getSeekRange() as SeekRange
  const position = player.getPosition()
  return positionToPercent(position, range)
}

/**
 * Convert percentage position on the timeline to a position in seconds.
 */
export function percentToPosition(player: clpp.Player, percent: number): number {
  const ratio = percent / 100
  const seekRange = player.getSeekRange() as SeekRange
  const timeRange = seekRange.end - seekRange.start
  return (ratio * timeRange) + seekRange.start
}

/**
 * Seek to a position expressed as a percentage of the seek range.
 *
 * @example <caption>Seek to the middle of the video</caption>
 *
 * seekToPercent(player, 50)
 */
export async function seekToPercent(player: clpp.Player, percent: number) {
  const target = percentToPosition(player, percent)
  await player.seek(target)
}

function isPreOrPostCue (cue: clpp.TimelineCue): boolean {
  const cueAttribute = cue.customAttributes?.CUE
  if (!cueAttribute) {return false}
  if (cue.schemeIdUri !== 'com.apple.hls.interstitial') {return false}
  if (cueAttribute.includes('PRE') || cueAttribute.includes('POST')) {
    return true
  }
  return false
}

export function getUiCues (player: clpp.Player): Cue[] {
  const range = player.getSeekRange() as SeekRange
  return player.getTimelineCues()
    .filter(cue => !isPreOrPostCue(cue))
    .map(cue => {
      return {
        start: positionToPercent(cue.startTime, range),
        end: positionToPercent(cue.endTime, range),
        isPoint: cue.customAttributes?.['X-TIMELINE-OCCUPIES'] === 'POINT',
      }
    })
}

/**
 * Base class for tracking state.
 * 
 * TODO add an option to only listen to changes of one attribute.
 */
export class State<T> {
  callbacks: Callback[]
  state: T

  constructor (defaultState: T) {
    this.callbacks = []
    this.state = defaultState
  }

  on (callback: Callback) {
    this.callbacks.push(callback)
    return () => {
      this.off(callback)
    }
  }

  off (callback: Callback) {
    this.callbacks = this.callbacks.filter(c => c !== callback)
  }

  get(): T {
    return this.state
  }

  set(state: Partial<T>) {
    this.state = { ...this.state, ...state }
    this.callbacks.forEach(callback => callback())
  }
}
