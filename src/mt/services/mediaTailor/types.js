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
 *    adPollingFrequencySeconds: (number|undefined),
 * }} MtSessionConfig
 * 
 * @param adPollingFrequencySeconds 
 *  Program the player to poll the tracking URL periodically and manage ad avails accordingly.
 *  Poll frequently enough to satisfy your reporting requirements. If you don't have set requirements,
 *  poll at least once per manifest duration. For example, if the manifest is a 10-minute rolling window,
 *  poll the tracking URL every 5 minutes. MediaTailor keeps mid-roll tracking data until all corresponding
 *  segments are outside the manifest window.
 *  @see {@link https://docs.aws.amazon.com/mediatailor/latest/ug/ad-reporting-client-side.html}
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

/**
 * Config for Media Tailor session initialization for playback of an asset.
 * 
 * @typedef {{
 *    sessionUri: string,
 *    adsParams: (Object|undefined),
 *    adPollingFrequencySeconds: (number|undefined),
 * }} MtAssetConfig
 */
