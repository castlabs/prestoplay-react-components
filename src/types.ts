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
