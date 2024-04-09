export type HlsInterstitial = {
  /**
   * Ordering number of a HLS interstitial asset inside its pod. (starts from 1)
   */
  podOrder: number
  /**
   * Number of assets in one HLS interstitial (pod).
   */
  podCount: number
}

/**
 * Player Controls visible during playback of HLS interstitial assets.
 */
export type InterstitialControls = {
  audio: boolean
  fullScreen: boolean
  pause: boolean
  seekButtons: boolean
  time: boolean
}
