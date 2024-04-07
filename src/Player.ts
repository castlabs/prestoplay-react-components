import { clpp } from '@castlabs/prestoplay'

import { EventEmitter, EventListener, EventType } from './EventEmitter'
import { Controls, ControlsVisibilityMode } from './services/controls'
import {
  fromPrestoTrack,
  getAbrTrack,
  getActiveTrack,
  getDisabledTrack,
  getTracks,
  getUnavailableTrack,
  Track,
  TrackType,
} from './Track'
import { defaultTrackLabel, defaultTrackSorter, TrackLabeler, TrackLabelerOptions, TrackSorter } from './TrackLabeler'
import { Disposer } from './types'

/**
 * The player initializer is a function that receives the presto play instance
 * once it is created and can be used to configure and initialize the core
 * player further. This allows you to, for instance, add components to the
 * player, configure request and response modifiers and interact with the
 * presto API just after player initialization.
 */
export type PlayerInitializer = (presto: clpp.Player) => void

/**
 * Internal helper to queue prestoplay function calls while the player is not
 * yet initialized
 */
type Action = () => Promise<void>

type Range = {
  start: number
  end: number
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
  Unset = clpp.Player.State.UNSET,
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
  slideInMenuVisible: boolean
  /**
   * Triggered when the `PlayerControls` visibility changes
   */
  controlsVisible: boolean
  /**
   * Triggered when a track selection changes
   */
  trackSelected: Track
  /**
   * Triggered when the selected video track changes
   */
  videoTrackChanged: Track
  /**
   * Triggered when the selected audio track changes
   */
  audioTrackChanged: Track
  /**
   * Triggered when the selected text track changes
   */
  textTrackChanged: Track
  /**
   * Triggered when the available text track change
   */
  textTracksAvailable: Track[]
  /**
   * Triggered when the available audio track change
   */
  audioTracksAvailable: Track[]
  /**
   * Triggered when the available video track change
   */
  videoTracksAvailable: Track[]
  /**
   * Triggered when the currently playing video rendition changes, i.e.
   * a quality change
   */
  playingVideoTrackChanged: Track | undefined
  /**
   * Triggered on a user interaction (i.e. mouse hover) on top of the
   * player surface
   */
  surfaceInteraction: undefined
  /**
   * Triggered when the hover position changes
   */
  hoverPosition: { position: number; percent: number }
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
  volumechange: { volume: number; muted: boolean }
  /**
   * State change events are triggered when the player state changes
   */
  statechanged: {
    currentState: State
    previousState: State
    timeSinceLastStateChangeMS: number
    reason?: clpp.events.BufferingReasons
  }
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
const isEnabledState = (state: State): boolean => {
  return state !== State.Idle && state !== State.Unset && state !== State.Error
}

/**
 * The player class provides to top level interface to interact with the core
 * player. It will create the PRESTOplay instance, and it offers access to the
 * related apis as well as dedicated events that are important for UI interactions.
 */
export class Player {
  /**
   * The player instance
   */
  private pp_: clpp.Player | null = null
  /**
   * We maintain a queue of actions that will be posted towards the player
   * instance once it is initialized
   */
  private _actionQueue_: Action[] = []
  /**
   * Function that resolves the player initialization
   */
  private _actionQueueResolved?: () => void
  /**
   * A promise that resolves once the player is initialized
   */
  private readonly _actionQueuePromise: Promise<void>
  /**
   * The player initializer
   */
  private readonly _initializer?: PlayerInitializer
  /**
   * Internal state that indicates that the "controls" are visible
   */
  private _controlsVisible = false
  /**
   * Internal controls that indicate that the slide in menu is visible
   */
  private _slideInMenuVisible = false
  /**
   * The currently playing video track
   */
  private _playingVideoTrack: Track | undefined
  /**
   * The currently selected video track
   */
  private _videoTrack: Track = getUnavailableTrack('video')
  /**
   * The currently selected audio track
   */
  private _audioTrack: Track = getUnavailableTrack('audio')
  /**
   * The currently selected text track
   */
  private _textTrack: Track = getUnavailableTrack('text')
  /**
   * All available video tracks
   */
  private _videoTracks: Track[] = []
  /**
   * All available audio tracks
   */
  private _audioTracks: Track[] = []
  /**
   * All available text tracks
   */
  private _textTracks: Track[] = []
  /**
   * The track sorter
   */
  private _trackSorter: TrackSorter = defaultTrackSorter
  /**
   * The track labeler
   */
  private _trackLabeler: TrackLabeler = defaultTrackLabel
  /**
   * The track labeler options
   */
  private _trackLabelerOptions?: TrackLabelerOptions
  /**
   * The event emitter for UI related events
   */
  private readonly _eventEmitter = new EventEmitter<UIEvents>()
  /**
   * This is true while we are waiting for a user initiated seek even to
   * complete
   */
  private _isUserSeeking = false
  /**
   * The target of the last user initiated seek event. We use this in case
   * there were more seek events while we were waiting for the last event
   * to complete
   */
  private _userSeekingTarget = -1
  /**
   * Proxy the playback rate
   */
  private _rate = 1
  /**
   * The current player configuration
   */
  private _config: clpp.PlayerConfiguration | null = null
  /**
   * Indicate that the config was loaded
   */
  private _configLoaded = false
  /**
   * UI control visibility manager
   */
  private _controls = new Controls()
  /**
   * Disposers of listeners on the PRESTOplay player instance
   */
  private _prestoDisposers: Disposer[] = []

  constructor(initializer?: PlayerInitializer) {
    this._initializer = initializer
    this._actionQueuePromise = new Promise<void>((resolve) => {
      this._actionQueueResolved = resolve
    })
    this._controls.onChange = (visible) => {
      this.emitUIEvent('controlsVisible', visible)
    }
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
  async init(element: HTMLVideoElement | string, baseConfig?: clpp.PlayerConfiguration) {
    if (this.pp_) {return}

    this.pp_ = new clpp.Player(element, baseConfig)

    this.attachListeners_(this.pp_)

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
   * Attach listeners to PRESTOplay events
   */
  private attachListeners_(player: clpp.Player) {
    const createTrackChangeHandler = (type?: TrackType) => {
      return () => {
        const trackManager = this.trackManager
        if (!trackManager) {return}

        if (!type || type === 'video') {
          this.videoTrack = getActiveTrack(trackManager, 'video')
          this.videoTracks = getTracks(trackManager, 'video')
        }
        if (!type || type === 'audio') {
          this.audioTrack = getActiveTrack(trackManager, 'audio')
          this.audioTracks = getTracks(trackManager, 'audio')
        }
        if (!type || type === 'text') {
          this.textTrack = getActiveTrack(trackManager, 'text')
          this.textTracks = getTracks(trackManager, 'text')
        }
      }
    }

    const onTracksAdded = createTrackChangeHandler()
    const onAudioTrackChanged = createTrackChangeHandler('audio')
    const onVideoTrackChanged = createTrackChangeHandler('video')
    const onTextTrackChanged = createTrackChangeHandler('text')
    player.on(clpp.events.TRACKS_ADDED, onTracksAdded)
    player.on(clpp.events.AUDIO_TRACK_CHANGED, onAudioTrackChanged)
    player.on(clpp.events.VIDEO_TRACK_CHANGED, onVideoTrackChanged)
    player.on(clpp.events.TEXT_TRACK_CHANGED, onTextTrackChanged)

    const onStateChanged = (event: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const e = event
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const currentState = toState(e.detail.currentState)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const previousState = toState(e.detail.previousState)

      this.emitUIEvent('statechanged', {
        currentState,
        previousState,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        reason: e.detail.reason,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timeSinceLastStateChangeMS: e.detail.timeSinceLastStateChangeMS,
      })

      if (isEnabledState(currentState) !== isEnabledState(previousState)) {
        this.emitUIEvent('enabled', isEnabledState(currentState))
      }

      if (!isEnabledState(currentState) || currentState === State.Paused) {
        this._controls.pin()
      } else {
        this._controls.unpin()
      }
    }
    player.on(clpp.events.STATE_CHANGED, onStateChanged)

    const onTimeupdate = () => {
      const position = player.getPosition()
      if (position != null) {
        this.emitUIEvent('position', position)
      }
    }
    player.on('timeupdate', onTimeupdate)

    this._rate = player.getPlaybackRate()
    const onRateChange = () => {
      const ppRate = player.getPlaybackRate()

      if (ppRate != null && this.state !== State.Buffering) {
        this._rate = ppRate
        this.emitUIEvent('ratechange', this.rate)
      }
    }
    player.on('ratechange', onRateChange)

    const onDurationChange = () => {
      const duration = player.getDuration()
      if (duration != null) {
        this.emitUIEvent('durationchange', duration)
      }
    }
    player.on('durationchange', onDurationChange)

    const onVolumeChange = () => {
      this.emitUIEvent('volumechange', {
        volume: this.volume,
        muted: this.muted,
      })
    }
    player.on('volumechange', onVolumeChange)

    const onBitrateChange = (e: any) => {
      const tm = this.trackManager

      if (tm) {
        this.playingVideoTrack = fromPrestoTrack(tm, e.detail.rendition as clpp.Rendition, 'video')
      } else {
        this.playingVideoTrack = undefined
      }
    }
    player.on(clpp.events.BITRATE_CHANGED, onBitrateChange)

    this._prestoDisposers.push(() => {
      player.on(clpp.events.TRACKS_ADDED, onTracksAdded)
      player.on(clpp.events.AUDIO_TRACK_CHANGED, onAudioTrackChanged)
      player.on(clpp.events.VIDEO_TRACK_CHANGED, onVideoTrackChanged)
      player.on(clpp.events.TEXT_TRACK_CHANGED, onTextTrackChanged)
      player.on(clpp.events.STATE_CHANGED, onStateChanged)
      player.on('timeupdate', onTimeupdate)
      player.on('ratechange', onRateChange)
      player.on('durationchange', onDurationChange)
      player.on('volumechange', onVolumeChange)
      player.on(clpp.events.BITRATE_CHANGED, onBitrateChange)
    })
  }

  /**
   * Remove listeners to PRESTOplay events
   */
  private removeListeners_ () {
    this._prestoDisposers.forEach(dispose => dispose())
    this._prestoDisposers = []
  }

  get trackManager() {
    return this.pp_?.getTrackManager() ?? null
  }

  /**
   * Seek to the given position. Calling this function has no effect unless the
   * presto instance is already initialized.
   *
   * @param position The target position in seconds
   */
  set position(position: number) {
    if (!this.pp_) {return}

    if (!this._isUserSeeking) {
      // issue a user seek to the target position and
      // listen for the completion.
      const handleSeekCompleted = () => {
        this._isUserSeeking = false
        if (this._userSeekingTarget !== position) {
          // we received another seek in between and have to execute that now
          this.position = this._userSeekingTarget
        } else {
          this._userSeekingTarget = -1
          const position = this.pp_?.getPosition()
          if (position) {
            this.emitUIEvent('position', position)
          }
        }
      }
      this._isUserSeeking = true
      this._userSeekingTarget = position
      this.pp_.seek(position).finally(handleSeekCompleted)
      this.emitUIEvent('position', position)
    } else {
      // we are already seeking. Update the target. When the current
      // seek operation is completed, we will seek again to the final target
      this._userSeekingTarget = position
      this.emitUIEvent('position', position)
    }
  }

  get position() {
    if (!this.pp_) {return 0}
    if (this._isUserSeeking) {
      return this._userSeekingTarget
    }
    return this.pp_.getPosition()
  }

  get duration(): number {
    return (this.pp_ && this.pp_.getDuration() > 0) ? this.pp_.getDuration() : 0
  }

  get live(): boolean {
    return this.pp_ ? this.pp_.isLive() : false
  }

  get seekRange(): Range {
    return this.pp_ ? this.pp_.getSeekRange() as Range : { start: 0, end: 0 }
  }

  get volume(): number {
    return this.pp_ ? this.pp_.getVolume() ?? 0 : 1
  }

  set volume(volume: number) {
    if (this.pp_) {
      if (this.muted && volume > 0) {
        this.muted = false
      }
      this.pp_.setVolume(volume)
    }
  }

  get muted() {
    return this.pp_ ? this.pp_.isMuted() ?? false : false
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
    if (!this.pp_) {return 1}
    return this._rate
  }

  set rate(value: number) {
    if (this.pp_) {
      this._rate = value
      this.pp_.setPlaybackRate(value)
      if (this.state === State.Buffering) {
        this.emitUIEvent('ratechange', value)
      }
    }
  }

  get playing() {
    if (!this.pp_) {return false}
    if (this.state === State.Idle) {return false}
    return !this.pp_.isPaused()
  }

  set playing(value: boolean) {
    if (this.pp_) {
      if (!this._configLoaded && value) {
        this.load().then(() => {
          value ? this.pp_?.play() : this.pp_?.pause()
        }).catch(() => {})
      } else {
        if (this._configLoaded) {
          value ? this.pp_?.play() : this.pp_?.pause()
        }
      }
    }
  }

  load(config?: clpp.PlayerConfiguration, autoload = false) {
    if (config) {
      this._config = config
      return this.action(async () => {
        await this.reset_()
        if (config && autoload) {
          this._configLoaded = true
          await this.pp_?.load(config)
        }
      })
    } else {
      return this.action(async () => {
        await this.pp_?.release()
        if (this._config) {
          this._configLoaded = true
          await this.pp_?.load(this._config)

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

  private async reset_() {
    this.removeListeners_()
    if (this.pp_) {
      await this.pp_.release()
    }
    this._configLoaded = false
    this.emitUIEvent('position', 0)
    this.emitUIEvent('durationchange', 0)
    this.videoTracks = []
    this.audioTracks = []
    this.textTracks = []
    this.videoTrack = getDisabledTrack('video', true)
    this.audioTrack = getDisabledTrack('audio', true)
    this.textTrack = getDisabledTrack('text', true)
  }

  setHoverPosition(position: number, percent: number) {
    this.emitUIEvent('hoverPosition', {
      position, percent,
    })
  }


  get controlsVisible(): boolean {
    return this._controls.visible
  }

  set controlsVisible(value: boolean) {
    this._controls.setVisible(value)
  }

  set controlsAutoHideDelayMs(value: number) {
    this._controls.hideDelayMs = value
  }

  set controlsVisibilityMode(value: ControlsVisibilityMode) {
    this._controls.mode = value
  }

  get slideInMenuVisible(): boolean {
    return this._slideInMenuVisible
  }

  set slideInMenuVisible(value: boolean) {
    if (value !== this._slideInMenuVisible) {
      this._slideInMenuVisible = value
      this.emitUIEvent('slideInMenuVisible', value)
    }

    this.controlsVisible = !value
  }

  /**
   * This method registers a surface interaction. We consider any user
   * interaction with the interface or the controls here. This can be used for
   * instance to show overlays for a short period of time and hide them
   * if no interaction was registered.
   */
  surfaceInteraction() {
    this.emitUIEvent('surfaceInteraction', undefined)

    if (!this.slideInMenuVisible) {
      this.controlsVisible = true
    }
  }


  get playingVideoTrack(): Track | undefined {
    return this._playingVideoTrack
  }

  set playingVideoTrack(value: Track | undefined) {
    if (isSameTrack(value, this._playingVideoTrack)) {return}
    this._playingVideoTrack = value
    this.emitUIEvent('playingVideoTrackChanged', value)
  }

  async presto(): Promise<clpp.Player> {
    await this._actionQueuePromise
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (this.pp_ as clpp.Player)
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
    return this._videoTrack
  }

  private set videoTrack(track: Track) {
    if (isSameTrack(this._videoTrack, track)) {return}
    this._videoTrack = track
    // this._videoTracks.forEach(t => t.selected = t.id === track.id)
    this.emitUIEvent('videoTrackChanged', track)
  }

  get audioTrack(): Track {
    return this._audioTrack
  }

  private set audioTrack(track: Track) {
    if (isSameTrack(this._audioTrack, track)) {return}
    this._audioTrack = track
    this.emitUIEvent('audioTrackChanged', track)
  }

  get textTrack(): Track {
    return this._textTrack
  }

  private set textTrack(track: Track) {
    if (isSameTrack(this._textTrack, track)) {return}
    this._textTrack = track
    this.emitUIEvent('textTrackChanged', track)
  }

  get textTracks(): Track[] {
    return this._textTracks
  }

  set textTracks(value: Track[]) {
    if (value.length > 0 && !value.find(t => t.id === 'abr')) {
      // since we have text tracks available, we add the off track
      const hasSelected = value.find(t => t.selected)
      const offTrack = getDisabledTrack('text', !hasSelected)
      value.push(offTrack)
    }

    if (isSameTrackList(this.textTracks, value)) {return}
    this._textTracks = value.sort(this._trackSorter)
    this.emitUIEvent('textTracksAvailable', value)
  }

  get audioTracks(): Track[] {
    return this._audioTracks
  }

  set audioTracks(value: Track[]) {
    if (isSameTrackList(this.audioTracks, value)) {return}
    this._audioTracks = value.sort(this._trackSorter)
    this.emitUIEvent('audioTracksAvailable', value)
  }

  get videoTracks(): Track[] {
    return this._videoTracks
  }

  set videoTracks(value: Track[]) {
    value = value.filter(v => {
      return v.ppTrack && v.ppTrack.height && v.ppTrack.width
    })
    if (value.length > 0 && !value.find(t => t.id === 'abr')) {
      // since we have video tracks available, we add the ABR track
      const hasSelected = value.find(t => t.selected)
      const abrTrack = getAbrTrack()
      abrTrack.selected = !hasSelected
      value.push(abrTrack)
    }
    if (isSameTrackList(this._videoTracks, value)) {
      return
    }
    this._videoTracks = value.sort(this._trackSorter)
    this.emitUIEvent('videoTracksAvailable', value)
  }

  activeTrack(type: TrackType): Track {
    switch (type) {
      case 'video':
        return this.videoTrack
      case 'text':
        return this.textTrack
      case 'audio':
        return this.audioTrack
    }
  }

  selectTrack(track: Track) {
    const tm = this.trackManager
    if (!tm) {return}

    try {
      if (track.id === 'abr') {
        tm.setVideoTrack(null)
        this.videoTrack = getActiveTrack(tm, 'video')
        this.videoTracks = getTracks(tm, 'video')
      } else {
        track.selected = true
        if (track.type === 'audio') {
          tm.setAudioTrack(track.ppTrack)
          this.audioTrack = getActiveTrack(tm, 'audio')
          this.audioTracks = getTracks(tm, 'audio')
        } else if (track.type === 'text') {
          tm.setTextTrack(track.ppTrack)
          this.textTrack = getActiveTrack(tm, 'text')
          this.textTracks = getTracks(tm, 'text')
        } else if (track.type === 'video') {
          tm.setVideoRendition(track.ppTrack, true)
          this.videoTrack = getActiveTrack(tm, 'video')
          this.videoTracks = getTracks(tm, 'video')
        }
      }
      this.emitUIEvent('trackSelected', track)
    } catch (error) {
      console.warn('unable to select track', error, track)
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
    this._trackLabeler = value
  }

  set trackLabelerOptions(value: TrackLabelerOptions) {
    this._trackLabelerOptions = value
  }

  emitUIEvent<K extends EventType<UIEvents>>(type: K, data: UIEvents[K]): void {
    this._eventEmitter.emit(type, data)
  }

  offUIEvent<K extends EventType<UIEvents>>(type: K, listener: EventListener<UIEvents[K]>): void {
    this._eventEmitter.off(type, listener)
  }

  onUIEvent<K extends EventType<UIEvents>>(type: K, listener: EventListener<UIEvents[K]>): void {
    this._eventEmitter.on(type, listener)
  }
}

const isSameTrack = (a?: Track, b?: Track): boolean => {
  if (a && b) {
    return a.type === b.type &&
      a.ppTrack === b.ppTrack &&
      a.selected === b.selected &&
      a.id === b.id
  }

  return !a && !b
}

const isSameTrackList = (a: Track[], b: Track[]): boolean => {
  return a.length === b.length
    && a.every((at) => b.find(bt => isSameTrack(at, bt)))
    && b.every((bt) => a.find(at => isSameTrack(bt, at)))
}
