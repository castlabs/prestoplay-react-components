/**
 * Ad event.
 * 
 * @typedef {{
 *    type: string,
 *    params: ?
 * }} AdEvent
 * 
 * @param {string} type := 'ready'|'progress'|'impression'|'started'|'first-quartile'|'midpoint'
 *    |'third-quartile'|'completed'|'ended'
 */

/**
 * Ad event listener.
 * 
 * @typedef {function(AdEvent): void} AdEventListener
 */ 

/**
 * Playback state / player state.
 * 
 * @typedef {string} PlaybackState := "playing"|"paused"|"stopped"
 */

/**
 * Start of playback timeline.
 * 
 * @typedef {{
 *   date: Date,
 *   startTimeSec: number
 * }} TimelineStart
 */

/**
 * Ad parameters.
 * 
 * @typedef {{
 *    platform: string,
 *    advertisingId: string,
 *    anchorElement: HTMLElement
 * }} AdParameters
 */
