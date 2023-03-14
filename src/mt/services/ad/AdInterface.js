/**
 * Advertisement.
 */
export class AdInterface {
  /**
   * @param {PlaybackState} playbackState
   * @param {number} playback position in seconds (of content / content with SSAI)
   */
  notify(playbackState, playbackPositionSec) {}

  /**
   * @param {!AdEventListener} listener 
   */
  setEventListener(listener) {}

  /**
   * @param {number} timeSec time in seconds.
   * @return {boolean} true if ad should start at this time.
   */
  shouldStart(timeSec) {
    return false
  }

  /**
   * Display this ad (immediately).
   */
  display() {}
}
