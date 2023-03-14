/**
 * Innovid Ad.
 * 
 * @typedef {{
 *    id: string,
 *    iFrameResource: string,
 *    durationSec: number,
 *    positionSec: number
 * }} InnoAd
 * 
 * @param id
 * @param iFrameResource URI to feed to an iframe (from IFrameResource tag from Innovid VAST)
 * @param durationSec duration of the ad in seconds (from Duration tag from Innovid VAST)
 * @param positionSec position since the start of the video when the ad should be displayed in seconds
 */

/**
 * Innovid Ad event.
 * 
 * @typedef {{
 *    type: string,
 *    params: ?{duration: number, position: number}
 * }} InnoAdEvent
 * 
 * 
 * Event types:
 * 
 * iroll-ready
 * iroll-started
 * iroll-video-progress {duration: 15.083, position: 0.1}
 * 
 * iroll-impression
 * iroll-video-started
 * iroll-video-first-quartile
 * iroll-video-midpoint
 * iroll-video-third-quartile
 * iroll-video-completed
 * iroll-ended
 * 
 * iroll-expand
 * iroll-collapse
 * 
 * iroll-request-playback-pause - player should pause video playback
 * iroll-request-playback-resume - player should resume video playback
 * iroll-request-playback-restart-on-resume - player should save position, stop video playback and prepare
 *      to restart playback on next iroll-request-playback-resume request
 * 
 * FUTURE integrate the play/pause/restart requests.
 * FUTURE tack ad events back to server for analytics.
 */


/**
 * Innovid Ad event listener.
 * 
 * @typedef {function(InnoAdEvent): void} InnoAdEventListener
 */

/**
 * Iroll platform.
 * 
 * @typedef {"firetv" | "samsung" | "xbox360" | "xboxone" | "switch" | "ps4"} IrollRuntimePlatform
 */

/**
 * Iroll ad runtime parameters.
 * 
 * @typedef {{
 *   keyMap? : {
 *     UP          : number,
 *     DOWN        : number,
 *     LEFT        : number,
 *     RIGHT       : number,
 *     ENTER       : number,
 *     BACK        : number,
 *     PLAY_PAUSE? : number,
 *   },
 * 
 *   platform      : IrollRuntimePlatform,
 *   advertisingId : string,
 *   ssai          : boolean
 * }} IrollRuntimeParameters
 * 
 */
 