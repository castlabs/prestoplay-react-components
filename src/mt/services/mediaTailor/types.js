/**
 * Media Tailor session info.
 * 
 * @typedef {{
 *    manifestUri: URI,
 *    trackingUri: URI,
 *    startDate: Date
 * }} MtSessionInfo
 * 
 * @param manifestUri Video manifest URL
 * @param trackingUri URL to load non-linear ads (Note: that it has very little to do with tracking)
 * @param startDate Date when the playback session started
 */

/**
 * Media Tailor session config.
 * 
 * @typedef {{
 *    supportedApiFrameworks: !Array<string>,
 * }} MtSessionConfig
 */

/**
 * Media Tailor Ad Avail (seems to be something like an ad break).
 * 
 * @typedef {{
 *    availId: string,
 *    durationInSeconds: number,
 *    nonLinearAdsList: !MtNonLinearAdsList,
 *    startTimeInSeconds: number
 * }} MtAdAvail
 */

/**
 * Media Tailor Non Linear Ad.
 * 
 * @typedef {Array<{
 *    nonLinearAdList: !Array<!MtNonLinearAd>,
 *    trackingEvents: !Array<!MtNonLinearTrackingEvent>
 * }>} MtNonLinearAdsList
 */

/**
 * Media Tailor Non Linear Tracking event.
 * 
 * @typedef {Array<{
 *    beaconUrls: !Array<string>,
 *    eventType: string
 * }>} MtNonLinearTrackingEvent
 * 
 * TODOMT what event types are there?
 */

/**
 * Media Tailor Non Linear Ad.
 * 
 * @typedef {{
 *    adId: string,
 *    apiFramework: string,
 *    durationInSeconds: number,
 *    iFrameResource: string
 * }} MtNonLinearAd
 */

/**
 * Media Tailor Ad.
 * 
 * @typedef {{
 *    apiFramework: string,   
 *    availId: string,
 *    id: string,
 *    iFrameResource: string,
 *    durationSec: number,
 *    positionSec: number
 * }} MtAd
 * 
 *  TODOMT what about telling Scott that I need also API framework?
 */
 
/**
 * Media Tailor Ad response.
 * 
 * @typedef {{
 *    avails: !Array<!MtAdAvail>
 * }} MtAdResponse
 */

/**
 * Callback with a Media Tailor Ad.
 * 
 * @typedef {function(MtAd): void} MtAdDataCallback
 */

/**
 * Start of playback timeline.
 * 
 * @typedef {{
 *   date: Date,
 *   startTimeSec: number
 * }} MtPlaybackTimelineStart
 */
