import { clpp } from '@castlabs/prestoplay'
import React, { useContext, useRef } from 'react'

import { PrestoContext } from '../../context/PrestoContext'
import { Player } from '../../Player'
import { Ad } from '../../types'

import { Callback, Cue, El } from './types'
import { getUiCues, mousePercentX, percentToPosition, playerPositionPercent, seekToPercent, State } from './utils'

type BarProps = {
  className?: string
  style?: React.CSSProperties
}

type StateType = {
  /**
   * Video progress in percent.
   */
  progress: number
  /**
   * Hover position in percent.
   */
  hoverPosition: number | null
  /**
   * Timeline cues.
   */
  cues: Cue[]
  /**
   * Ad video progress in percent.
   */
  adProgress: number | null
}

class SeekBarState extends State<StateType> {
  lastHoverPosition: number | null = null
  hoverPositionCallbacks: Callback[] = []

  onHoverPositionChange(callback: Callback) {
    this.hoverPositionCallbacks.push(callback)
  }

  offHoverPositionChange(callback: Callback) {
    this.hoverPositionCallbacks = this.hoverPositionCallbacks.filter(c => c !== callback)
  }

  set(state: Partial<StateType>) {
    super.set(state)

    if (state.hoverPosition !== undefined) {
      if (this.lastHoverPosition !== state.hoverPosition) {
        this.hoverPositionCallbacks.forEach(callback => callback())
      }
      this.lastHoverPosition = state.hoverPosition
    }
  }
}


class SeekBarEl extends El {
  constructor(
    parent: HTMLElement,
    public props: BarProps,
    public player: clpp.Player,
    public playerState: Player,
  ) {
    super(parent)
  }

  mount () {
    const state = new SeekBarState({
      progress: 0,
      hoverPosition: null,
      cues: getUiCues(this.player),
      adProgress: null,
    })

    const seekBarEl = document.createElement('div')
    this.appendChild(this.parent, seekBarEl)
    seekBarEl.classList.add('pp-ui-seekbar-2')
    if (seekBarEl.className) {
      seekBarEl.classList.add(seekBarEl.className)
    }

    if (this.props.style) {
      Object.assign(seekBarEl.style, this.props.style)
    }

    const onHoverChange = () => {
      const percent = state.get().hoverPosition
      if (percent == null) {
        this.playerState.setHoverPosition(null)
      } else {
        const position = percentToPosition(this.player, percent)
        this.playerState.setHoverPosition({ position, percent })
      }
    }
    const onTimeupdate = () => {
      state.set({ progress: playerPositionPercent(this.player) })
    }
    const onCues = () => {
      state.set({ cues: getUiCues(this.player) })
    }
    const onAdChanged = (ad: Ad|null) => {
      if (ad) {
        seekBarEl.classList.add('ad')
        state.set({ adProgress: ad.progress })
      } else {
        seekBarEl.classList.remove('ad')
        state.set({ adProgress: null })
      }
    }
    this.player.on('timeupdate', onTimeupdate)
    this.player.on(clpp.events.TIMELINE_CUES_CHANGED, onCues)
    this.playerState.onUIEvent('adChanged', onAdChanged)
    state.onHoverPositionChange(onHoverChange)
    this.disposers.push(() => {
      this.player.off('timeupdate', onTimeupdate)
      this.player.off(clpp.events.TIMELINE_CUES_CHANGED, onCues)
      this.playerState.offUIEvent('adChanged', onAdChanged)
      state.offHoverPositionChange(onHoverChange)
    })

    this.mountChildren([
      new MouseAreaEl(seekBarEl, state, {
        onClick: async () => {
          const value = state.get()
          const isAd = value.adProgress != null
          const hoverPos = value.hoverPosition
          if (!isAd && hoverPos) {
            await seekToPercent(this.player, hoverPos)
          }
        },
      }),
    ])

    const handleLoadStart = () => {
      this.unmount()
      this.mount()
    }
    this.player.on('loadstart', handleLoadStart)
    this.disposers.push(() => {
      this.player.off('loadstart', handleLoadStart)
    })
  }
}



type MouseAreaCallbacks = {
  onClick: () => void
}

class MouseAreaEl extends El {
  constructor(
    parent: HTMLElement,
    public state: SeekBarState,
    public callbacks: MouseAreaCallbacks,
  ) {
    super(parent)
  }

  mount () {
    const mouseAreaEl = document.createElement('div')
    mouseAreaEl.classList.add('pp-ui-mouse-area')
    this.appendChild(this.parent, mouseAreaEl)

    const valleyEl = document.createElement('div')
    valleyEl.classList.add('pp-ui-valley')
    this.appendChild(mouseAreaEl, valleyEl)

    const handleMouseDown = () => {
      this.callbacks.onClick()
    }
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation()
    }
    const handleMouseMove = (e: MouseEvent) => {
      this.state.set({
        hoverPosition: mousePercentX(e, valleyEl),
      })
    }
    const handleMouseLeave = () => {
      this.state.set({
        hoverPosition: null,
      })
    }
    mouseAreaEl.addEventListener('mousedown', handleMouseDown)
    mouseAreaEl.addEventListener('click', handleClick)
    mouseAreaEl.addEventListener('mousemove', handleMouseMove)
    mouseAreaEl.addEventListener('mouseleave', handleMouseLeave)
    this.disposers.push(() => {
      mouseAreaEl.removeEventListener('mousedown', handleMouseDown)
      mouseAreaEl.removeEventListener('click', handleClick)
      mouseAreaEl.removeEventListener('mousemove', handleMouseMove)
      mouseAreaEl.removeEventListener('mouseleave', handleMouseLeave)
    })

    this.mountChildren([
      new ProgressEl(valleyEl, this.state),
      new CuesEl(valleyEl, this.state),
    ])
  }
}

class ProgressEl extends El {
  constructor(
    parent: HTMLElement,
    public state: SeekBarState,
  ) {
    super(parent)
  }

  mount () {
    const outlineEl = document.createElement('div')
    outlineEl.classList.add('pp-ui-progress-outline')
    this.appendChild(this.parent, outlineEl)

    const progressEl = document.createElement('div')
    progressEl.classList.add('pp-ui-progress')
    this.appendChild(outlineEl, progressEl)

    const ballEl = document.createElement('div')
    ballEl.classList.add('pp-ui-cursor')
    this.appendChild(this.parent, ballEl)

    const off = this.state.on(() => {
      const value = this.state.get()

      if (value.adProgress != null) {
        if (value.adProgress < 5) {
          progressEl.classList.add('low')
        } else {
          progressEl.classList.remove('low')
        }
        // Multiplier to compensate for lag caused by animation
        const MULTIPLIER = 1.1
        progressEl.style.width = `${value.adProgress * MULTIPLIER}%`
        ballEl.style.visibility = 'hidden'
        return
      }

      const percent = value.hoverPosition ?? value.progress
      progressEl.style.width = `${percent}%`

      if (value.hoverPosition == null) {
        ballEl.style.visibility = 'hidden'
        ballEl.style.left = '0%'
      } else {
        ballEl.style.left = `${percent}%`
        ballEl.style.visibility = 'visible'
      }
    })

    this.disposers.push(off)
  }
}

class CuesEl extends El {
  constructor(
    parent: HTMLElement,
    public state: SeekBarState,
  ) {
    super(parent)
  }

  mount () {
    let lastCues: Cue[] = []

    const containerEl = document.createElement('div')
    containerEl.classList.add('pp-ui-cues')
    this.appendChild(this.parent, containerEl)

    const off = this.state.on(() => {
      const cues = this.state.get().cues
      if (lastCues === cues) {
        return
      }
      lastCues = cues
      this.mountChildren(cues.map(cue => new CueEL(containerEl, cue)))
    })

    this.disposers.push(off)
  }
}

class CueEL extends El {
  constructor(
    parent: HTMLElement,
    public cue: Cue,
  ) {
    super(parent)
  }

  mount () {
    const cueEl = document.createElement('div')
    cueEl.classList.add('pp-ui-cue')
    this.appendChild(this.parent, cueEl)

    cueEl.style.minWidth = '2px'
    cueEl.style.left = `${this.cue.start}%`
    if (this.cue.isPoint) {
      cueEl.style.width = '4px'
    } else {
      cueEl.style.right = `${100 - this.cue.end}%`
    }
  }
}

function renderSeekBarEl (container: HTMLDivElement, props: BarProps, presto: clpp.Player, player: Player) {
  const el = new SeekBarEl(container, props, presto, player)
  el.mount()
  return () => {
    el.unmount()
  }
}


function useRenderVanilla  (props: BarProps) {
  const { presto, player } = useContext(PrestoContext)
  const containerRef = useRef<HTMLDivElement|null>(null)
  const destroyRef = useRef<() => void>(() => {})

  const onContainerRef = (ref: HTMLDivElement) => {
    if (containerRef.current === ref || !presto) {
      return
    }

    destroyRef.current()
    destroyRef.current = () => {}
    if (ref) {
      destroyRef.current = renderSeekBarEl(ref, props, presto, player)
    }
    containerRef.current = ref
  }

  return onContainerRef
}


/**
 * Seek bar version 2.
 *
 * Idea: this is a vanilla JS opinionated seek bar (less configurable
 * and simpler).
 */
export const SeekBar2 = React.memo((props: BarProps) => {
  const ref = useRenderVanilla(props)
  return (<div ref={ref} className="pp-ui-w-100"></div>)
})

SeekBar2.displayName = 'SeekBar2'
