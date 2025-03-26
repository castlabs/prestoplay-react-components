/**
 * A function that disposes of a resource.
 */
export type Disposer = () => void

export type Cue = {
  /**
   * ID of the cue.
   */
  id: string
  /**
   * End time of the cue in seconds.
   */
  endTime: number
  /**
   * Start time of the cue in seconds.
   */
  startTime: number
}


export type Ad = {
  /**
   * Progress of ad video in percent.
   */
  progress: number
  /**
   * Number of seconds remaining in the ad.
   */
  remainingSec: number
  /**
   * If true the ad can be skipped.
   */
  canSkip: boolean
  /**
   * Number of ads in the same ad pod overall.
   */
  podCount: number
  /**
   * Order of this ad in its ad pod, from (1 to podCount).
   */
  podOrder: number
  /**
   * True if the ad is playing false if paused.
   */
  playing: boolean
}
