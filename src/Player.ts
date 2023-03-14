// @ts-ignore
import {clpp} from '@castlabs/prestoplay'
import {
  fromPrestoTrack,
  getAbrTrack,
  getActiveTrack,
  getDisabledTrack,
  getTracks,
  getUnavailableTrack,
  Track,
  TrackType,
} from "./Track";
import {LanguageCodes} from "./LanguageCodes";
import {EventEmitter, EventListener, EventType} from "./EventEmitter";

/**
 * The player initializer is a function that receives the presto play instance
 * once it is created and can be used to configure and initialize the core
 * player further. This allows you to, for instance, add components to the
 * player, configure request and response modifiers and interact with the
 * presto API just after player initialization.
 */
export type PlayerInitializer = (presto: any) => void

/**
 * Base interface for track labeler functions
 */
export interface TrackLabelerOptions {
}

/**
 * A track labeler is a function that receives a track, the player, and some
 * options and returns a label for the track.
 */
export type TrackLabeler = (track: Track, player: Player, options?: TrackLabelerOptions) => string
/**
 * The track sorter is used to sort track lists
 */
export type TrackSorter = (a: Track, b: Track) => number

/**
 * The default track labeler options
 */
export interface DefaultTrackLabelerOptions extends TrackLabelerOptions {
  /**
   * If true, the currently playing rendition quality rendered as `<height>p`
   * is added to the ABR label for video tracks when the player is in ABR mode
   */
  usePlayingRenditionInAbrLabel?: boolean
  /**
   * We are translating language tags, i.e. 'de', by default ot the english
   * name, i.e. 'German'. With this option set to true, the native language name
   * will be used instead, i.e. 'Deutsch'
   */
  useNativeLanguageNames?: boolean
  /**
   * The label that is used for ABR tracks, defaults to 'Auto'
   */
  abrLabel?: string
  /**
   * The labels that is used for disabled track, defaults to 'Off'
   */
  disabledTrackLabel?: string
  /**
   * The label that is used for unknown tracks, defaults to 'Unknown'
   */
  unknownTrackLabel?: string
  /**
   * If defined, the bitrate is shown for video tracks in the chosen units.
   */
  showVideoBitrate?: 'Mbps'
}

/**
 * Internal helper to queue prestoplay function calls while the player is not
 * yet initialized
 */
type Action = () => Promise<void>;

/**
 * The default track labeler
 *
 * @param t The track
 * @param player The player
 * @param _options Labeler options
 */
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
    if (!t.ppTrack.height) {
       return opts.unknownTrackLabel
    }

    let result = `${t.ppTrack.height}p`

    if (opts.showVideoBitrate === 'Mbps' && t.ppTrack.bandwidth) {
      result += ` (${(t.ppTrack.bandwidth / 1048576).toFixed(1)} Mbps)`
    }

    return result
  } else {
    if (t.label) {
      return t.label
    }
    if (t.ppTrack.language) {
      // @ts-ignore
      let lang = LanguageCodes[t.ppTrack.language]
      if (lang) {
        if (opts.useNativeLanguageNames) {
          return lang.native
        }
        return lang.name
      }
    }

    let trackList = player[`${t.type}Tracks`];
    let i = trackList.indexOf(t);
    if (i >= 0 && trackList.length > 1) {
      return `${opts.unknownTrackLabel}`
    }
    return `${opts.unknownTrackLabel}`
  }
}

/**
 * The default track sorter sorts by height, label, and language
 *
 * @param a
 * @param b
 */
export const defaultTrackSorter: TrackSorter = (a: Track, b: Track) => {
  if (!a.ppTrack) return -1
  if (!b.ppTrack) return 1
  if (a.ppTrack.height && b.ppTrack.height) {
    return b.ppTrack.height - a.ppTrack.height
  }
  if (a.label && b.label) {
    return a.label.localeCompare(b.label)
  }
  if (a.ppTrack.language && b.ppTrack.language) {
    return a.ppTrack.language.localeCompare(b.ppTrack.language)
  }
  return 0
}

/**
 * Player states
 */
export enum State {
  /**
   * 0 - when player has been created or released
   */
  Idle = clpp.Player.State.IDLE,
  /**
   * 1 - when player receives the api command to load the movie until it starts
   * requesting the first fragment
   */
  Preparing = clpp.Player.State.PREPARING,
  /**
   * 2 - when player doesn't have enough data to play the content for any
   * reasons
   */
  Buffering = clpp.Player.State.BUFFERING,
  /**
   * 3 - when player starts playing content
   */
  Playing = clpp.Player.State.PLAYING,
  /**
   * 4 - when player is stopped
   */
  Paused = clpp.Player.State.PAUSED,
  /**
   * 5 - when video is ended
   */
  Ended = clpp.Player.State.ENDED,
  /**
   * 6 - when player encounters an error
   */
  Error = clpp.Player.State.ERROR,
  /**
   * 7 - Used exclusively to indicate previous state, when it has no state yet
   */
  Unset = clpp.Player.State.UNSET
}

/**
 * Buffering reasons
 */
export enum BufferingReason {
  Seeking = clpp.events.BufferingReasons.SEEKING,
  NoData = clpp.events.BufferingReasons.NO_DATA
}

const toBufferingReason = (value?: number): BufferingReason | undefined => {
  switch (value) {
    case clpp.events.BufferingReasons.NO_DATA:
      return BufferingReason.NoData
    case clpp.events.BufferingReasons.SEEKING:
      return BufferingReason.Seeking
    default:
      return undefined
  }
}

const toState = (state: number): State => {
  switch (state) {
    case clpp.Player.State.IDLE:
      return State.Idle
    case clpp.Player.State.PREPARING:
      return State.Preparing
    case clpp.Player.State.BUFFERING:
      return State.Buffering
    case clpp.Player.State.PLAYING:
      return State.Playing
    case clpp.Player.State.PAUSED:
      return State.Paused
    case clpp.Player.State.ENDED:
      return State.Ended
    case clpp.Player.State.ERROR:
      return State.Error
    case clpp.Player.State.UNSET:
      return State.Unset
    default:
      return State.Unset
  }
}

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
  /**
   * Position changes are posted using this event. The event posts the current
   * position. This event is emitted when the underlying video element emits a
   * timeupdate event or when a seek is issued.
   */
  position: number
  /**
   * Duration changes are exposed through this event
   */
  durationchange: number
  /**
   * Volume change event that is triggered when the volume or the muted
   * state is changed
   */
  volumechange: { volume: number, muted: boolean }
  /**
   * State change events are triggered when the player state changes
   */
  statechanged: {
    currentState: State,
    previousState: State,
    timeSinceLastStateChangeMS: number,
    reason?: BufferingReason
  },
  /**
   * Event triggered when the playback rate changed
   */
  ratechange: number
  /**
   * Helper event that is triggered when the player enters (or leaves) a state
   * where controls should be enabled. The player is considered disabled in
   * Unset, Idle, and Error states.
   */
  enabled: boolean
}

/**
 * Helper that returns true if the given state is considered to be one of the
 * enabled states
 * @param state
 */
const isEnabledState = (state:State):boolean => {
  return state != State.Idle && state != State.Unset && state != State.Error
}

/**
 * The player class provides to top level interface to interact with the core
 * player. It will create the PRESTOplay instance, and it offers access to the
 * related apis as well as dedicated events that are important for UI interactions.
 */
export class Player {
  /**
   * The player instance
   * @private
   */
  private pp_: any = null;
  /**
   * We maintain a queue of actions that will be posted towards the player
   * instance once it is initialized
   *
   * @private
   */
  private _actionQueue_: Action[] = []
  /**
   * Function that resolves the player initialization
   *
   * @private
   */
  private _actionQueueResolved?: () => void
  /**
   * A promise that resolves once the player is initialized
   * @private
   */
  private readonly _actionQueuePromise: Promise<void>
  /**
   * The player initializer
   * @private
   */
  private readonly _initializer?: PlayerInitializer

  /**
   * Internal state that indicates that the "controls" are visible
   *
   * @private
   */
  private _controlsVisible = false
  /**
   * Internal controls that indicate that the slide in menu is visible
   * @private
   */
  private _slideInMenuVisible = false
  /**
   * The currently playing video track
   *
   * @private
   */
  private _playingVideoTrack: Track | undefined;

  /**
   * The currently selected video track
   *
   * @private
   */
  private _videoTrack: Track = getUnavailableTrack("video")
  /**
   * The currently selected audio track
   * @private
   */
  private _audioTrack: Track = getUnavailableTrack("audio")
  /**
   * The currently selected text track
   *
   * @private
   */
  private _textTrack: Track = getUnavailableTrack("text")

  /**
   * All available video tracks
   *
   * @private
   */
  private _videoTracks: Track[] = []
  /**
   * All available audio tracks
   *
   * @private
   */
  private _audioTracks: Track[] = []

  /**
   * All available text tracks
   *
   * @private
   */
  private _textTracks: Track[] = []

  /**
   * The track sorter
   *
   * @private
   */
  private _trackSorter: TrackSorter = defaultTrackSorter

  /**
   * The track labeler
   *
   * @private
   */
  private _trackLabeler: TrackLabeler = defaultTrackLabel

  /**
   * The track labeler options
   * @private
   */
  private _trackLabelerOptions?: TrackLabelerOptions

  /**
   * The event emitter for UI related events
   *
   * @private
   */
  private readonly _eventEmitter = new EventEmitter<UIEvents>()

  /**
   * This is true while we are waiting for a user initiated seek even to
   * complete
   *
   * @private
   */
  private _isUserSeeking = false

  /**
   * The target of the last user initiated seek event. We use this in case
   * there were more seek events while we were waiting for the last event
   * to complete
   *
   * @private
   */
  private _userSeekingTarget = -1

  /**
   * Proxy the playback rate
   * @private
   */
  private _rate = 1;

  /**
   * The current player configuration
   *
   * @private
   */
  private _config: any;

  /**
   * Indicate that the config was loaded
   * @private
   */
  private _configLoaded = false;

  constructor(initializer?: PlayerInitializer) {
    this._initializer = initializer;
    this._actionQueuePromise = new Promise<void>((resolve) => {
      this._actionQueueResolved = resolve
    })
  }

  /**
   * Initializer that is called with the video element (or the id of the
   * video element) once it is available. The video element is used to create
   * the presto play instance. Once the instance is created, the initializer
   * is executed and all pending action are triggered.
   *
   * If the player is already initialized, this function does not do anything.
   *
   * @param element The video element or the ID of the video element
   * @param baseConfig PRESTOplay config to initialize the player with
   */
  async init(element: HTMLVideoElement | string, baseConfig: any) {
    if (this.pp_) return;

    this.pp_ = new clpp.Player(element, baseConfig)
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

    this.pp_.on(clpp.events.STATE_CHANGED, (e: any) => {
      let currentState = toState(e.detail.currentState);
      let previousState = toState(e.detail.previousState);
      this.emitUIEvent("statechanged", {
        currentState: currentState,
        previousState: previousState,
        reason: toBufferingReason(e.detail.reason),
        timeSinceLastStateChangeMS: e.detail.timeSinceLastStateChangeMS
      })

      if (isEnabledState(currentState) != isEnabledState(previousState)) {
        this.emitUIEvent("enabled", isEnabledState(currentState))
      }
    })

    this.pp_.on("timeupdate", () => {
      this.emitUIEvent("position", this.pp_.getPosition())
    })

    this.pp_.on("ratechange", () => {
      let ppRate = this.pp_.getPlaybackRate();
      if (this.state != State.Buffering) {
        this._rate = ppRate
        this.emitUIEvent("ratechange", this.rate)
      }
    })

    this.pp_.on("durationchange", () => {
      this.emitUIEvent("durationchange", this.pp_.getDuration())
    })

    this.pp_.on("volumechange", () => {
      this.emitUIEvent("volumechange", {
        volume: this.volume,
        muted: this.muted
      })
    })

    this.pp_.on(clpp.events.BITRATE_CHANGED, (e: any) => {
      if (e && e.detail) {
        this.playingVideoTrack = fromPrestoTrack(this.pp_, e.detail.rendition, 'video');
      } else {
        this.playingVideoTrack = undefined
      }
      handlePlayerTracksChanged("video")
    })

    this._rate = this.pp_.getPlaybackRate()

    if (this._initializer) {
      this._initializer(this.pp_)
    }
    for (let i = 0; i < this._actionQueue_.length; i++) {
      await this._actionQueue_[i]()
    }
    this._actionQueue_ = []
    if (this._actionQueueResolved) {
      this._actionQueueResolved()
    }
  }

  /**
   * Seek to the given position. Calling this function has no effect unless the
   * presto instance is already initialized.
   *
   * @param position The target position in seconds
   */
  set position(position: number) {
    if (!this.pp_) return

    if (!this._isUserSeeking) {
      // issue a user seek to the target position and
      // listen for the completion.
      const handleSeekCompleted = () => {
        this._isUserSeeking = false;
        if (this._userSeekingTarget != position) {
          // we received another seek in between and have to execute that now
          this.position = this._userSeekingTarget
        } else {
          this._userSeekingTarget = -1
          this.emitUIEvent("position", this.pp_.getPosition())
        }
      }
      this._isUserSeeking = true
      this._userSeekingTarget = position
      this.pp_.seek(position).finally(handleSeekCompleted)
      this.emitUIEvent("position", position)
    } else {
      // we are already seeking. Update the target. When the current
      // seek operation is completed, we will seek again to the final target
      this._userSeekingTarget = position
      this.emitUIEvent("position", position)
    }
  }

  get position() {
    if (!this.pp_) return 0
    if (this._isUserSeeking) {
      return this._userSeekingTarget
    }
    return this.pp_.getPosition()
  }

  get duration(): number {
    return this.pp_ ? this.pp_.getDuration() : 0
  }

  get live(): boolean {
    return this.pp_ ? this.pp_.isLive() : false
  }

  get seekRange(): { start: number, end: number } {
    return this.pp_ ? this.pp_.getSeekRange() : {start: 0, end: 0}
  }

  get volume(): number {
    return this.pp_ ? this.pp_.getVolume() : 1
  }

  set volume(volume: number) {
    if (this.pp_) {
      if(this.muted && volume > 0) {
        this.muted = false
      }
      this.pp_.setVolume(volume)
    }
  }

  get muted() {
    return this.pp_ ? this.pp_.isMuted() : false
  }

  set muted(muted: boolean) {
    if (this.pp_) {
      this.pp_.setMuted(muted)
    }
  }

  get state(): State {
    return this.pp_ ? toState(this.pp_.getState()) : State.Unset
  }

  get rate() {
    if (!this.pp_) return 1
    return this._rate
  }

  set rate(value: number) {
    if (this.pp_) {
      this._rate = value
      this.pp_.setPlaybackRate(value)
      if (this.state == State.Buffering) {
        this.emitUIEvent("ratechange", value)
      }
    }
  }

  get playing() {
    if(!this.pp_) return false
    if (this.state == State.Idle) return false
    return !this.pp_.isPaused()
  }

  set playing(value: boolean) {
    if (this.pp_) {
      if (!this._configLoaded && value) {
        this.load().then(() => {
          value ? this.pp_.play() : this.pp_.pause()
        })
      } else {
        if (this._configLoaded) {
          value ? this.pp_.play() : this.pp_.pause()
        }
      }
    }
  }

  load(config?: any, autoload: boolean = false) {
    if (!config) {
      return this.action(async () => {
        await this.pp_.release()
        if (this._config) {
          this._configLoaded = true
          await this.pp_.load(this._config)

        }
      })
    } else {
      this._config = config
      return this.action(async () => {
        await this.reset_()
        if (config && autoload) {
          this._configLoaded = true
          await this.pp_.load(config)
        }
      })
    }
  }

  get config() {
    return this._config
  }

  async release() {
    this._config = null
    await this.reset_()
  }

  setConfigLoaded_() {
    this._configLoaded = true
  }

  private async reset_() {
    if (this.pp_) {
      await this.pp_.release()
    }
    this._configLoaded = false
    this.emitUIEvent("position", 0)
    this.emitUIEvent("durationchange", 0)
    this.videoTracks = []
    this.audioTracks = []
    this.textTracks = []
    this.videoTrack = getDisabledTrack("video", true)
    this.audioTrack = getDisabledTrack("audio", true)
    this.textTrack = getDisabledTrack("text", true)
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

  /**
   * This method registers a surface interaction. We consider any user
   * interaction with the interface or the controls here. This can be used for
   * instance to show overlays for a short period of time and hide them
   * if no interaction was registered.
   */
  surfaceInteraction() {
    this.emitUIEvent("surfaceInteraction", undefined)
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
    await this._actionQueuePromise
    return this.pp_
  }

  /**
   * Execute an action or queue it if the player is not yet available
   *
   * @param a The action
   * @private
   */
  private async action(a: Action) {
    this.pp_ ? await a() : new Promise((resolve) => {
      this._actionQueue_.push(async () => {
        resolve(await a())
      })
    })
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
      let hasSelected = value.find(t => t.selected)
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
    value = value.filter(v => {
      return v.ppTrack && v.ppTrack.height && v.ppTrack.width
    })
    if (value.length > 0 && !value.find(t => t.id == 'abr')) {
      // since we have video tracks available, we add the ABR track
      let hasSelected = value.find(t => t.selected)
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

  get enabled() {
    return isEnabledState(this.state)
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

  private emitUIEvent<K extends EventType<UIEvents>>(type: K, data: UIEvents[K]): void {
    this._eventEmitter.emit(type, data)
  }

  offUIEvent<K extends EventType<UIEvents>>(type: K, listener: EventListener<UIEvents[K]>): void {
    this._eventEmitter.off(type, listener)
  }

  onUIEvent<K extends EventType<UIEvents>>(type: K, listener: EventListener<UIEvents[K]>): void {
    this._eventEmitter.on(type, listener)
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


export default Player
