/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clpp } from '@castlabs/prestoplay'

import { EventListener, EventType } from '../EventEmitter'
import { Player, UIEvents } from '../Player'
import { Disposer } from '../types'

import { HlsInterstitial } from './types'


export interface UIEventHlsi extends UIEvents {
  /**
   * Triggered when an HLS interstitial starts playing
   */
  hlsInterstitial: (HlsInterstitial | null)
  /**
   * Triggered when primary content playback ended
   */
  ended: undefined
  /**
   * Triggered when the player instance changes (e.g. when switching between
   * primary and interstitial player(s))
   */
  playerChanged: clpp.Player
}


/**
 * Player of HLS Interstitial streams
 */
export class PlayerHlsi extends Player {
  /**
   * The HLS interstitial player instance
   */
  private _ip: clpp.interstitial.Player | null = null
  private _options: clpp.interstitial.Options | null = null
  private _interstitialCues: clpp.interstitial.UiCue[] = []
  /**
   * True if interstitial asset content currently playing
   * (as opposed to primary content)
   */
  private _isPlayingInterstitial = false
  private _disposers: Disposer[] = []

  /**
   * Initialize the HLS Interstitial player
   */
  initHlsi(options: clpp.interstitial.Options) {
    if (this._ip) {return}

    this.refreshCues_()

    this._options = options
    this._ip = new clpp.interstitial.Player(options)

    this.on('interstitial-item-started', (event) => {
      this.emitUIEvent('hlsInterstitial', {
        podOrder: event.detail.podOrder as number,
        podCount: event.detail.podCount as number,
      })
      this._isPlayingInterstitial = true
    })

    this.on('interstitial-ended', () => {
      this.emitUIEvent('hlsInterstitial', null)
      this._isPlayingInterstitial = false
    })

    this.on('cues-changed', () => {
      this.refreshCues_()
    })

    this.on('item-changed', () => {
      const item = this._ip?.getCurrentItem() ?? null
      if (!item || !item.player) {
        console.error('Interstitial: item-changed event without item/player')
        return
      }

      const player = item.player
      this.pp_ = player

      this.removePrestoListeners_()
      this.refreshPrestoState_(player)
      this.attachPrestoListeners_(player)
      this.emitUIEvent('playerChanged', player)
    })

    this.on('primary-ended', () => {
      this.emitUIEvent('ended', undefined)
    })
  }

  /**
   * Load an asset paused.
   */
  async loadHlsi(config?: clpp.PlayerConfiguration) {
    if (!this._ip || !config) {return}
    await this._ip.loadPaused(config)
    // To enabled play/pause button
    this._configLoaded = true
  }

  /**
   * Unpause the currently loaded (paused) asset.
   */
  async unpause() {
    if (!this._ip) {return}
    await this._ip.unpause()
  }

  /**
   * Reset this player to a completely fresh state (same as newly constructed).
   */
  async reset() {
    await this._ip?.destroy()
    this._ip = null
    await this.release()
    if (this._options) {
      this.initHlsi(this._options)
    }
  }

  /**
   * Destroy the player
   */
  async destroy() {
    this._disposers.forEach((dispose) => dispose())
    this._disposers = []
    await this._ip?.destroy()
    this._ip = null
    await this.release()
  }

  /**
   * Get HLS Interstitial cues.
   */
  getInterstitialCues() {
    return this._interstitialCues
  }

  emitUIEvent<K extends EventType<UIEventHlsi>>(type: K, data: UIEventHlsi[K]): void {
    super.emitUIEvent(type as any, data as any)
  }

  offUIEvent<K extends EventType<UIEventHlsi>>(type: K, listener: EventListener<UIEventHlsi[K]>): void {
    super.offUIEvent(type as any, listener as any)
  }

  onUIEvent<K extends EventType<UIEventHlsi>>(type: K, listener: EventListener<UIEventHlsi[K]>): void {
    super.onUIEvent(type as any, listener as any)
  }

  private refreshCues_ () {
    if (this._isPlayingInterstitial) {
      this.setCues([])
      return
    }

    this._interstitialCues = (this._ip?.getCues() ?? [])
    const cues = this._interstitialCues.map((cue) => {
      return {
        id: cue.cueId,
        startTime: cue.startTime,
        endTime: cue.endTime,
      }
    })
      .filter(cue => cue.startTime > 2) // remove interstitial preroll cue(s)
    this.setCues(cues)
  }

  /**
   * Attach an event listener to the interstitial player
   */
  private on(event: string, listener: EventListener<any>) {
    if (!this._ip) {return}
    // @ts-ignore
    this._ip.on(event, listener)
    this._disposers.push(() => {
      // @ts-ignore
      this._ip.off(event, listener)
    })
  }
}
