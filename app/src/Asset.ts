export interface Asset {
  /**
   * The player configuration
   */
  config: any
  /**
   * Optional asset title
   */
  title?: string
  /**
   * Poster URL
   */
  poster?: string
  /**
   * Optional asset subtitle
   */
  subtitle?: string
}

/**
 * Expose some test assets
 */
export const TestAssets:Asset[] = [
  {
    title: "Maldives",
    subtitle: "State of the Mahal Dibiyat",
    poster: "https://cl-player-content.s3.amazonaws.com/340p-maldives.jpg",
    config: {
      source: "https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd",
      autoplay: true,
      muted: true
    },
  },
  {
    title: "Agent 327",
    subtitle: "Blender Studios",
    poster: "https://cl-player-content.s3.amazonaws.com/340p-agent-327.jpg",
    config: {
      source: {
        url: "https://content.players.castlabs.com/demos/drm-agent/manifest.mpd",
        type: "application/dash+xml",
        drmProtected: true
      },
      autoplay: true,
      muted: true,
      drm: {
        env: "DRMtoday_STAGING",
        customData: {
          merchant: "client_dev",
          userId: "purchase",
          sessionId: "default",
        }
      },
    },
  },
  {
    title: "The most awesome game",
    subtitle: "Akamai Live",
    poster: "https://cl-player-content.s3.amazonaws.com/340p-game.jpg",
    config: {
      source: "https://akamaibroadcasteruseast.akamaized.net/cmaf/live/657078/akasource/out.mpd",
      autoplay: true,
      muted: true
    },
  }
]
