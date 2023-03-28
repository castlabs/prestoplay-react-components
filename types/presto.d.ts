/**
 * Taken from @see {@link https://demo.castlabs.com/#/docs?q=clpp.Player}
 */
declare module '@castlabs/prestoplay' {
  export namespace clpp {
    type EventCallback = (name: string, payload: Record<string, any>) => void

    interface IClass {
      new (): unknown
    }

    export class Player {
      constructor(element: HTMLElement|string, config: any)

      static State: {
        IDLE: 0
        PREPARING: 1
        BUFFERING: 2
        PLAYING: 3
        PAUSED: 4
        ENDED: 5
        ERROR: 6
        UNSET: 7
      }

      destroy(): Promise<void>
      /**
       * Duration in seconds or -1 if the duration is unknown.
       */
      getDuration(): number
      getPlaybackRate(): number
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
      seek(time: number): Promise<void>
      setMuted(is: boolean): void
      /**
       * Set speed of the playback, where 1 means "normal" speed.
       */
      setPlaybackRate(rate: number): void
      /**
       * The volume as a value between 0 and 1.
       */
      setVolume(volume: number): void
      use(component: IClass): void
    }

    /**
     * @see {@link https://demo.castlabs.com/#/docs?q=clpp.TrackManager}
     */
    export class TrackManager {
      getAudioTrack(): Track | null
      getAudioTracks(): Track[]
      getTextTrack(): Track | null
      getTextTracks(): Track[]
      getVideoRendition(): Rendition | null
      getVideoTrack(): Track | null
      getVideoTracks(): Track[]
      isAbrEnabled(): boolean
      setAudioTrack(track: Track | null): void
      setTextTrack(track: Track | null): void
      setVideoRendition(rendition: Rendition, clearBuffer: boolean): void
      setVideoTrack(track: Track | null): void
    }

    /**
     * @see {@link https://demo.castlabs.com/#/docs?q=clpp.Rendition}
     */
    export type Rendition = {
      bandwidth: number
      height: number
      id: string
      originalId: string | null
      track: Track
      width: number
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

    export namespace events {
      export const BITRATE_CHANGED = 'bitratechanged'
      export const TRACKS_ADDED = 'tracksadded'
      export const AUDIO_TRACK_CHANGED = 'audiotrackchanged'
      export const VIDEO_TRACK_CHANGED = 'videotrackchanged'
      export const TEXT_TRACK_CHANGED = 'texttrackchanged'
      export const STATE_CHANGED = 'statechanged'

      export enum BufferingReasons {
        SEEKING,
        NO_DATA,
      }
    }

    export namespace Track {
      export enum Type {
        AUDIO = 'audio',
        TEXT = 'text',
        VIDEO = 'video',
      }
    }

    export namespace thumbnails {
      export class ThumbnailsPlugin {
        static Id: string
      }
    }

    export namespace vtt {
      export class VttComponent {}
    }

    export namespace ttml {
      export class TtmlComponent {}
    }

    export namespace htmlcue {
      export class HtmlCueComponent {}
    }

    export namespace hls {
      export class HlsComponent {}
    }

    export namespace dash {
      export class DashComponent {}
    }
  }
}
