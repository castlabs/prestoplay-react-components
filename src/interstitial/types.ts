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
