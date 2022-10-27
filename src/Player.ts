// @ts-ignore
import {clpp} from '@castlabs/prestoplay'
import React, {useEffect} from "react";
import {
  fromPrestoTrack, getAbrTrack,
  getActiveTrack, getDisabledTrack, getTracks, getUnavailableTrack,
  Track,
  TrackType,
} from "./Track";
import {LanguageCodes} from "./LanguageCodes";

type Action = () => Promise<void>;

type PlayerInitializer = (presto: any) => void

export interface TrackLabelerOptions{}

export type TrackLabeler = (track: Track, player: Player, options?: TrackLabelerOptions) => string
export type TrackSorter = (a: Track, b: Track) => number

export interface DefaultTrackLabelerOptions extends TrackLabelerOptions {
  usePlayingRenditionInAbrLabel?: boolean
  useNativeLanguageNames?: boolean
  abrLabel?: string
  disabledTrackLabel?: string
  unknownTrackLabel?: string
}

export const defaultTrackLabel: TrackLabeler = (t: Track, player: Player, _options?: DefaultTrackLabelerOptions) => {
  const opts = _options || {
    usePlayingRenditionInAbrLabel: false,
    useNativeLanguageNames: false,
  }

  opts.abrLabel = opts.abrLabel || "Auto"
  opts.disabledTrackLabel = opts.disabledTrackLabel || "Off"
  opts.unknownTrackLabel = opts.unknownTrackLabel || "Unknown"

  if (t.id == "abr") {
    if (!player.playingVideoTrack ||
      !player.playingVideoTrack.ppTrack ||
      !player.playingVideoTrack.ppTrack.height ||
      !opts.usePlayingRenditionInAbrLabel) {
      return opts.abrLabel
    } else {
      return `${opts.abrLabel} (${player.playingVideoTrack.ppTrack.height}p)`
    }
  }

  if (!t.ppTrack) {
    return opts.disabledTrackLabel
  }

  if (t.type == "video") {
    return t.ppTrack.height + "p"
  } else {
    if (t.label) {
      return t.label
    }
    if (t.ppTrack.language) {
      // @ts-ignore
      let lang = LanguageCodes[t.ppTrack.language]
      if(lang) {
        if (opts.useNativeLanguageNames) {
          return lang.native
        }
        return lang.name
      }
    }

    let trackList = player[`${t.type}Tracks`];
    let i = trackList.indexOf(t);
    if(i >= 0 && trackList.length > 1) {
      return `${opts.unknownTrackLabel} (${i+1})`
    }
    return `${opts.unknownTrackLabel}`
  }
}

export const defaultTrackSorter:TrackSorter = (a: Track, b: Track) => {
  if (!a.ppTrack) return -1
  if (!b.ppTrack) return 1
  if (a.ppTrack.height && b.ppTrack.height) {
    return b.ppTrack.height - a.ppTrack.height
  }
  if (a.label && b.label) {
    return a.label.localeCompare(b.label)
  }
  if(a.ppTrack.language && b.ppTrack.language) {
    return a.ppTrack.language.localeCompare(b.ppTrack.language)
  }
  return 0
}

/**
 * UI related events triggered by the Player
 */
export interface UIEvents {
  /**
   * Triggered when the slide in menu state changes
   */
  slideInMenuVisible: boolean,
  /**
   * Triggered when the `PlayerControls` visibility changes
   */
  controlsVisible: boolean,
  /**
   * Triggered when a track selection changes
   */
  trackSelected: Track,
  /**
   * Triggered when the selected video track changes
   */
  videoTrackChanged: Track,
  /**
   * Triggered when the selected audio track changes
   */
  audioTrackChanged: Track,
  /**
   * Triggered when the selected text track changes
   */
  textTrackChanged: Track,
  /**
   * Triggered when the available text track change
   */
  textTracksAvailable: Track[],
  /**
   * Triggered when the available audio track change
   */
  audioTracksAvailable: Track[],
  /**
   * Triggered when the available video track change
   */
  videoTracksAvailable: Track[],
  /**
   * Triggered when the currently playing video rendition changes, i.e.
   * a quality change
   */
  playingVideoTrackChanged: Track | undefined,
  /**
   * Triggered on a user interaction (i.e. mouse hover) on top of the
   * player surface
   */
  surfaceInteraction: undefined,
  /**
   * Triggered when the hover position changes
   */
  hoverPosition: { position: number, percent: number }
}

type EventPayload<E extends keyof UIEvents> = UIEvents[E]
type EventListener<E extends keyof UIEvents> = (data: EventPayload<E>) => any
type EventListenerList = Record<string, EventListener<any>[]>

interface EventEmitter {
  onUIEvent<E extends keyof UIEvents>(type: E, listener: EventListener<E>): void

  offUIEvent<E extends keyof UIEvents>(type: E, listener: EventListener<E>): void

  emitUIEvent<E extends keyof UIEvents>(type: E, data: UIEvents[E]): void
}


class UIEventEmitter implements EventEmitter {
  private listeners: EventListenerList = {}

  emitUIEvent<E extends keyof UIEvents>(type: E, data: EventPayload<E>): void {
    let listeners = this.listeners[type];
    if (listeners) {
      listeners.forEach((listener) => {
        listener.call(null, data)
      })
    }
  }

  offUIEvent<E extends keyof UIEvents>(type: E, listener: EventListener<E>): void {
    let listeners = this.listeners[type];
    if (listeners) {
      let i
      while ((i = listeners.indexOf(listener)) >= 0) {
        listeners.splice(i, 1)
      }
    }
  }

  onUIEvent<E extends keyof UIEvents>(type: E, listener: (data: EventPayload<E>) => any): void {
    let listeners = this.listeners[type];
    if (!listeners) {
      listeners = []
      this.listeners[type] = listeners
    }
    listeners.push(listener)
  }
}


const isSameTrack = (a: Track | undefined, b: Track | undefined): boolean => {
  if (!a && !b) return true
  if (!a && b) return false
  if (a && !b) return false

  return a!.type == b!.type &&
    a!.ppTrack == b!.ppTrack &&
    a!.selected == b!.selected &&
    a!.id == b!.id
}

const isSameTrackList = (a: Track[], b: Track[]): boolean => {
  return a.length == b.length
    && a.every((at) => b.find(bt => isSameTrack(at, bt)))
    && b.every((bt) => a.find(at => isSameTrack(bt, at)))
}

export class Player extends UIEventEmitter {
  public static readonly slideInMenuVisibleEvent = "pp-ui-slide-in-menu-visible";
  public static readonly controlsVisibleEvent = "pp-ui-controls-visible";
  public static readonly surfaceInteractionEvent = "pp-ui-surface-interaction";

  private pp_: any = null;
  private actionQueue_: Action[] = []
  private actionQueueResolved?: () => void
  private readonly actionQueuePromise: Promise<void>
  private readonly initializer?: PlayerInitializer

  private _controlsVisible = false
  private _slideInMenuVisible = false
  private _playingVideoTrack: Track | undefined;

  private _videoTrack: Track = getUnavailableTrack("video")
  private _audioTrack: Track = getUnavailableTrack("audio")
  private _textTrack: Track = getUnavailableTrack("text")

  private _videoTracks: Track[] = []
  private _audioTracks: Track[] = []
  private _textTracks: Track[] = []

  private _trackSorter:TrackSorter = defaultTrackSorter
  private _trackLabeler:TrackLabeler = defaultTrackLabel
  private _trackLabelerOptions?:TrackLabelerOptions

  constructor(initializer?: PlayerInitializer) {
    super()
    this.initializer = initializer;
    // noinspection JSIgnoredPromiseFromCall
    this.actionQueuePromise = new Promise<void>((resolve) => {
      this.actionQueueResolved = resolve
    })
  }

  init(element: HTMLVideoElement | string) {
    this.pp_ = new clpp.Player(element)

    const handlePlayerTracksChanged = (type?: TrackType) => {
      return () => {
        if (!type || type == "video") {
          this.videoTrack = getActiveTrack(this.pp_, "video")
          this.videoTracks = getTracks(this.pp_, "video")
        }
        if (!type || type == "audio") {
          this.audioTrack = getActiveTrack(this.pp_, "audio")
          this.audioTracks = getTracks(this.pp_, "audio")
        }
        if (!type || type == "text") {
          this.textTrack = getActiveTrack(this.pp_, "text")
          this.textTracks = getTracks(this.pp_, "text")
        }
      }
    }

    this.pp_.on(clpp.events.TRACKS_ADDED, handlePlayerTracksChanged())
    this.pp_.on(clpp.events.AUDIO_TRACK_CHANGED, handlePlayerTracksChanged("audio"))
    this.pp_.on(clpp.events.VIDEO_TRACK_CHANGED, handlePlayerTracksChanged("video"))
    this.pp_.on(clpp.events.TEXT_TRACK_CHANGED, handlePlayerTracksChanged("text"))

    this.pp_.on(clpp.events.BITRATE_CHANGED, (e: any) => {
      if (e && e.detail) {
        this.playingVideoTrack = fromPrestoTrack(this.pp_, e.detail.rendition, 'video');
      } else {
        this.playingVideoTrack = undefined
      }
      handlePlayerTracksChanged("video")
    })


    if (this.initializer) {
      this.initializer(this.pp_)
    }
    for (let i = 0; i < this.actionQueue_.length; i++) {
      this.actionQueue_[i]()
    }
    this.actionQueue_ = []
    if (this.actionQueueResolved) {
      this.actionQueueResolved()
    }
  }

  load(config: any) {
    this.action(() => {
      return this.pp_.load(config)
    })
  }

  release() {
    this.action(() => {
      return this.pp_.release()
    })
  }

  on(event: string, callback: (e: any) => void) {
    this.action(() => {
      this.pp_.on(event, callback)
      return Promise.resolve()
    })
  }

  off(event: string, callback: (e: any) => void) {
    this.action(() => {
      this.pp_.off(event, callback)
      return Promise.resolve()
    })
  }

  one(event: string, callback: (e: any) => void) {
    this.action(() => {
      this.pp_.one(event, callback)
      return Promise.resolve()
    })
  }

  use(component: any) {
    this.action(() => {
      this.pp_.use(component)
      return Promise.resolve()
    })
  }

  setHoverPosition(position: number, percent: number) {
    this.emitUIEvent("hoverPosition", {
      position, percent
    })
  }


  get controlsVisible(): boolean {
    return this._controlsVisible;
  }

  set controlsVisible(value: boolean) {
    if (value != this._controlsVisible) {
      this._controlsVisible = value;
      this.emitUIEvent("controlsVisible", value)
    }
  }


  get slideInMenuVisible(): boolean {
    return this._slideInMenuVisible;
  }

  set slideInMenuVisible(value: boolean) {
    if (value != this._slideInMenuVisible) {
      this._slideInMenuVisible = value;
      this.emitUIEvent("slideInMenuVisible", value)
    }
  }

  surfaceInteraction() {
    if (!this.controlsVisible && !this.slideInMenuVisible) {
      this.emitUIEvent("surfaceInteraction", undefined)
    }
  }


  get playingVideoTrack(): Track | undefined {
    return this._playingVideoTrack;
  }

  set playingVideoTrack(value: Track | undefined) {
    if (isSameTrack(value, this._playingVideoTrack)) return
    this._playingVideoTrack = value;
    this.emitUIEvent("playingVideoTrackChanged", value)
  }

  async presto() {
    await this.actionQueuePromise
    return this.pp_
  }

  private action(a: Action) {
    if (this.pp_) {
      a()
    } else {
      this.actionQueue_.push(a)
    }
  }

  get videoTrack(): Track {
    return this._videoTrack;
  }

  private set videoTrack(track: Track) {
    if (isSameTrack(this._videoTrack, track)) return
    this._videoTrack = track;
    // this._videoTracks.forEach(t => t.selected = t.id == track.id)
    this.emitUIEvent("videoTrackChanged", track)
  }

  get audioTrack(): Track {
    return this._audioTrack;
  }

  private set audioTrack(track: Track) {
    if (isSameTrack(this._audioTrack, track)) return
    this._audioTrack = track;
    this.emitUIEvent("audioTrackChanged", track)
  }

  get textTrack(): Track {
    return this._textTrack;
  }

  private set textTrack(track: Track) {
    if (isSameTrack(this._textTrack, track)) return
    this._textTrack = track;
    this.emitUIEvent("textTrackChanged", track)
  }

  get textTracks(): Track[] {
    return this._textTracks;
  }

  set textTracks(value: Track[]) {
    if (value.length > 0 && !value.find(t => t.id == 'abr')) {
      // since we have text tracks available, we add the off track
      let hasSelected = value.find(t=> t.selected)
      let offTrack = getDisabledTrack("text", !hasSelected);
      value.push(offTrack)
    }

    if (isSameTrackList(this.textTracks, value)) return
    this._textTracks = value.sort(this._trackSorter);
    this.emitUIEvent("textTracksAvailable", value)
  }

  get audioTracks(): Track[] {
    return this._audioTracks;
  }

  set audioTracks(value: Track[]) {
    if (isSameTrackList(this.audioTracks, value)) return
    this._audioTracks = value.sort(this._trackSorter);
    this.emitUIEvent("audioTracksAvailable", value)
  }

  get videoTracks(): Track[] {
    return this._videoTracks;
  }

  set videoTracks(value: Track[]) {
    if (value.length > 0 && !value.find(t => t.id == 'abr')) {
      // since we have video tracks available, we add the ABR track
      let hasSelected = value.find(t=> t.selected)
      let abrTrack = getAbrTrack();
      abrTrack.selected = !hasSelected
      value.push(abrTrack)
    }
    if (isSameTrackList(this._videoTracks, value)) {
      return
    }
    this._videoTracks = value.sort(this._trackSorter);
    this.emitUIEvent("videoTracksAvailable", value)
  }

  activeTrack(type: TrackType): Track {
    switch (type) {
      case "video":
        return this.videoTrack
      case "text":
        return this.textTrack
      case "audio":
        return this.audioTrack
    }
  }

  selectTrack(track: Track) {
    if (!this.pp_) {
      return
    }
    try {
      const presto = this.pp_
      const tm = presto.getTrackManager();
      if (track.id == 'abr') {
        tm.setVideoTrack(null)
        this.videoTrack = getActiveTrack(this.pp_, "video")
        this.videoTracks = getTracks(this.pp_, "video")
      } else {
        track.selected = true
        if (track.type == "audio") {
          tm.setAudioTrack(track.ppTrack)
          this.audioTrack = getActiveTrack(this.pp_, "audio")
          this.audioTracks = getTracks(this.pp_, "audio")
        } else if (track.type == "text") {
          tm.setTextTrack(track.ppTrack)
          this.textTrack = getActiveTrack(this.pp_, "text")
          this.textTracks = getTracks(this.pp_, "text")
        } else if (track.type == "video") {
          tm.setVideoRendition(track.ppTrack, true)
          this.videoTrack = getActiveTrack(this.pp_, "video")
          this.videoTracks = getTracks(this.pp_, "video")
        }
      }
      this.emitUIEvent("trackSelected", track)
    } catch (e) {
      console.log(`unable to select track: ${e}`, track)
    }
  }

  getTrackLabel(track: Track, labelTrack: TrackLabeler | undefined, options?: TrackLabelerOptions) {
    options = options || this._trackLabelerOptions
    labelTrack = labelTrack || this._trackLabeler
    return labelTrack(track, this, options)
  }


  set trackLabeler(value: TrackLabeler) {
    this._trackLabeler = value;
  }

  set trackLabelerOptions(value: TrackLabelerOptions) {
    this._trackLabelerOptions = value;
  }
}

export type EventHandler = (e: any, presto: any) => void
export type PrestoReceiver = (presto: any) => void

export function usePrestoEvent(eventName: string, player: Player, handler: EventHandler, dependencies?: any[]) {
  async function handleEvent(e: any) {
    let presto = await player.presto()
    handler(e, presto)
  }
  dependencies = dependencies || []

  useEffect(() => {
    player.on(eventName, handleEvent);
    return () => {
      player.off(eventName, handleEvent);
    }
  }, [player, ...dependencies])
}

export function usePrestoUiEvent<E extends keyof UIEvents>(eventName: E, player: Player, handler: EventListener<E>) {
  useEffect(() => {
    player.onUIEvent(eventName, handler);
    return () => {
      player.offUIEvent(eventName, handler);
    }
  }, [player])
}

export function usePresto(player: Player, receiver: PrestoReceiver) {
  useEffect(() => {
    let completed = false
    player.presto().then((presto) => {
      if (!completed) {
        receiver(presto)
      }
    })
    return () => {
      completed = true
    }
  }, [player])
}

export function useGlobalHide(ref: React.RefObject<Element>, hide: () => any) {
  useEffect(() => {
    let handleClick = async (event:MouseEvent) => {
      if (ref.current && !ref.current.contains((event.target as Node))) {
        await hide()
      }
    }
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  })
}
