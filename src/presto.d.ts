/**
 * Taken from @see {@link https://demo.castlabs.com/#/docs?q=clpp.Player}
 */
declare module '@castlabs/prestoplay' {
  export namespace clpp {
    type EventCallback = (name: string, payload: Record<string, any>) => void

    export class Player {
      destroy(): Promise<void>
      /**
       * Duration in seconds or -1 if the duration is unknown.
       */
      getDuration(): number
      getPlugin(id: string): PlayerPlugin | null
      getPosition(): number
      /**
       * Get the range of time (in seconds) that seeking is allowed.
       * If the player has not loaded content, this will return a range from 0 to 0.
       */
      getSeekRange(): { start: number; end: number }
      getState(): number
      getTrackManager(): TrackManager | null
      /**
       * The volume as a value between 0 and 1.
       */
      getVolume(): number
      isLive(): boolean
      isMuted(): boolean
      isPaused(): boolean
      load(config: string | clpp.Source | string[] | clpp.Source[] | clpp.PlayerConfiguration): Promise<void>
      off(event: string, callback: EventCallback): void
      one(event: string, callback: EventCallback): void
      on(event: string, callback: EventCallback): void
      pause(): Promise<void>
      play(): Promise<void>
      release(): Promise<void>
      setMuted(is: boolean): void
      /**
       * Set speed of the playback, where 1 means "normal" speed.
       */
      setPlaybackRate(rate: number): void
      /**
       * The volume as a value between 0 and 1.
       */
      setVolume(volume: number): void
      use(component: Function): void
    }

    /**
     * @see {@link https://demo.castlabs.com/#/docs?q=clpp.TrackManager#setVideoRendition}
     */
    export class TrackManager {
      setAudioTrack(track: Track): void
      setTextTrack(track: Track): void
      setVideoRendition(rendition: Rendition, clearBuffer: boolean): void
      setVideoTrack(track: Track): void
    }

    /**
     * @see {@link https://demo.castlabs.com/#/docs?q=clpp.Rendition#bandwidth}
     */
    export type Rendition = {
      id: string
      height: number
      bandwidth: number
      track: Track
    }

    /**
     * @see {@link https://demo.castlabs.com/#/docs?q=clpp.Track}
     */
    export type Track = {
      id: string
      type: string
      renditions: Rendition[]
    }

    export class PlayerPlugin {}

    export type Source = {
      url: string
      type?: string
      drmProtected: boolean
      name: string
      isLive: boolean
      videoMimeType: string
      audioMimeType: string
    }

    export type PlayerConfiguration = Record<string, any>
  }
}
