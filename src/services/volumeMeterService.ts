import { clpp } from '@castlabs/prestoplay'

type GradientColorStop = {
  stop: number
  color: string
}

type AnalyzerContext = {
  analyser: AnalyserNode
  dataArray: Uint8Array
}

export type ConfigInternal = {
  fontSize: number
  fontColor: string
  fontFamily: string
  backgroundColor: string
  barGradient: GradientColorStop[]
  barWidth?: number
  barLeftOffset?: number
  barSpacing: number
  smoothingTimeConstant: number
  frequencyBinCount: number
  levelLabel: (level: number) => string
  minDecibels: number
  maxDecibels: number
}

export type VuMeterConfig = Partial<ConfigInternal>

const DEFAULT_CONFIG: ConfigInternal = {
  fontSize: 12,
  fontColor: 'rgba(255, 255, 255, 0.7)',
  fontFamily: 'sans-serif',
  backgroundColor: 'rgba(0,0,0,1)',
  barGradient: [
    { stop: 0, color: 'green' },
    { stop: 0.8, color: 'yellow' },
    { stop: 1, color: 'red' },
  ],
  barSpacing: 4,
  smoothingTimeConstant: 0.4,
  frequencyBinCount: 1,
  levelLabel: (level => `${level} dB`),
  minDecibels: -100,
  maxDecibels: -30,
}

const dimensions = (element: HTMLCanvasElement) => {
  return {
    width: element.width,
    height: element.height,
  }
}

/**
 * Volume Meter Service.
 * It can analyze volume and animate the results on a canvas.
 */
export class VolumeMeterService {
  private animationRequestID: number | null = null
  private attachedVideoElement: HTMLMediaElement | null = null
  private audioCtx: AudioContext | null = null
  private audioSource: AudioNode | null = null
  private canvas: HTMLCanvasElement | null = null
  private config: ConfigInternal = DEFAULT_CONFIG
  private disposers: (() => void)[] = []
  private enabled = false
  private mediaElementToSourceNodeMap: Map<Element, AudioNode> = new Map()
  private log = new clpp.log.Logger('clpp.services.VuMeter')

  constructor (private player: clpp.Player) {}

  /**
   * Configure.
   */
  configure (canvas: HTMLCanvasElement, config?: VuMeterConfig) {
    this.canvas = canvas
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    this.log.info('VU meter configured', config)
  }

  /**
   * Mount the VU meter to the canvas element.
   */
  mount () {
    if (this.canvas) {
      this.drawEmpty(this.canvas)
      this.log.info('VU meter mounted')
    }

    // Handle start / re-start of content playback
    const onPlaying = () => {
      this.attachToMainVideo()
    }
    this.player.on('playing', onPlaying)
    this.disposers.push(() => this.player.off('playing', onPlaying))

    // Handle time update (if mounted after playback started)
    const onTimeupdate = () => {
      this.attachToMainVideo()
    }
    this.player.on('timeupdate', onTimeupdate)
    this.disposers.push(() => this.player.off('timeupdate', onTimeupdate))

    // Handle pause
    const onPaused = () => {
      this.disable()
    }
    this.player.on('paused', onPaused)
    this.disposers.push(() => this.player.off('paused', onPaused))

    // Handle end
    const onEnded = () => {
      this.disable()
    }
    this.player.on('ended', onEnded)
    this.disposers.push(() => this.player.off('ended', onEnded))
  }

  /**
   * Un-Mount the VU meter from the canvas element.
   */
  unmount () {
    this.disable()
    if (this.canvas) {
      this.clear(this.canvas)
      this.canvas = null
    }
    this.disposers.forEach(dispose => dispose())
    this.disposers = []
    this.log.info('VU meter un-mounted')
  }

  /**
   * Enable the VU meter - start measuring the audio volume.
   */
  enable () {
    if (this.enabled || !this.attachedVideoElement || !this.canvas) {
      return
    }

    this.log.info('VU meter enabled')

    this.enabled = true

    const audioContext = this.createAudioContext()
    this.audioSource = this.getAudioSource(audioContext, this.attachedVideoElement)
    const splitter = audioContext.createChannelSplitter(2)
    this.audioSource.connect(splitter)

    const leftAudioCtx = this.createAnalyserContext(audioContext, splitter, 0)
    const rightAudioCtx = this.createAnalyserContext(audioContext, splitter, 1)

    const paintRecursively = () => {
      this.animationRequestID = requestAnimationFrame(() => {
        if (!this.canvas) {return}
        this.draw(this.canvas, leftAudioCtx, rightAudioCtx)
        paintRecursively()
      })
    }

    paintRecursively()
  }

  /**
   * Disable the VU meter - stop measuring the audio volume.
   */
  disable () {
    if (!this.enabled) {
      return
    }

    if (this.animationRequestID != null) {
      cancelAnimationFrame(this.animationRequestID)
      this.animationRequestID = null
    }
    if (this.canvas) {
      this.drawEmpty(this.canvas)
    }

    this.enabled = false
  }

  /**
   * Attach to volume of the main video element.
   */
  private attachToMainVideo () {
    const media = this.player.getSurface()?.getMedia()

    if (media === this.attachedVideoElement) {
      if (!this.enabled) {
        this.enable()
      }
      return
    }

    this.disable()

    if (!media) {
      this.log.warn('Failed to get Main video element.')
      return
    }

    this.setVideoElement(media)
    this.enable()
    this.log.info('Attached to main video.')
  }

  private setVideoElement (element: HTMLMediaElement) {
    this.log.info(`VU meter set video element ID: ${element.id},` +
     ` classes: ${element.className}`)

    this.attachedVideoElement = element
  }

  private getAudioSource(audioContext: AudioContext, element: HTMLMediaElement): AudioNode {
    let audioSource = this.mediaElementToSourceNodeMap.get(element)
    if (audioSource) {
      return audioSource
    }
    audioSource = audioContext.createMediaElementSource(element)
    // `createMediaElementSource` disconnected audio from output,
    // so connect it back
    audioSource.connect(audioContext.destination)
    this.mediaElementToSourceNodeMap.set(element, audioSource)
    return audioSource
  }

  private clear (canvas: HTMLCanvasElement) {
    if (!canvas) {return}
    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) {return}

    const { width, height } = dimensions(canvas)
    canvasCtx.clearRect(0, 0, width, height)
  }

  private drawEmpty (canvas: HTMLCanvasElement) {
    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) {
      return
    }

    const { width, height } = dimensions(canvas)
    canvasCtx.clearRect(0, 0, width, height)
    canvasCtx.fillStyle = this.config.backgroundColor
    canvasCtx.fillRect(0, 0, width, height)

    // Render numbering
    canvasCtx.fillStyle = this.config.fontColor
    canvasCtx.font = `${this.config.fontSize}px ${this.config.fontFamily}`
    const steps = Math.round((
      this.config.maxDecibels - this.config.minDecibels) / 10)
    const startStep = Math.round(- this.config.maxDecibels / 10)
    const heightStep = height / steps
    for (let i = 1; i < steps; i++) {
      const label = this.config.levelLabel(-10 * (i + startStep))
      canvasCtx.fillText(label, 3, i * heightStep)
    }
  }

  private draw (canvas: HTMLCanvasElement, leftAudioCtx: AnalyzerContext, rightAudioCtx: AnalyzerContext) {
    this.drawEmpty(canvas)

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) {return}

    const { width, height } = dimensions(canvas)
    const leftBarHeight = this.computeBarHeight(leftAudioCtx, height)
    const rightBarHeight = this.computeBarHeight(rightAudioCtx, height)
    const barWidth = this.config.barWidth || (width / 6)
    const barLeftOffset = this.config.barLeftOffset || (3.4 * barWidth)
    const barSpacing = this.config.barSpacing

    const gradient = canvasCtx.createLinearGradient(0, height, 0, 0)
    this.config.barGradient.forEach(({ stop, color }) => {
      gradient.addColorStop(stop, color)
    })

    // Render volume bar
    canvasCtx.fillStyle = gradient
    canvasCtx.fillRect(barLeftOffset, height - leftBarHeight,
      barWidth, leftBarHeight)
    canvasCtx.fillRect(barLeftOffset + barWidth + barSpacing,
      height - rightBarHeight, barWidth, rightBarHeight)
  }

  private computeBarHeight (analyzerCtx: AnalyzerContext, maxHeight: number): number {
    const { analyser, dataArray } = analyzerCtx
    const MAX_VALUE = 255

    analyser.getByteFrequencyData(dataArray)

    const groupCount = this.config.frequencyBinCount
    const groupSize = dataArray.length / groupCount

    // Calculate the averages
    const averages: number[] = []
    for (let i = 0; i < groupCount; i++) {
      const start = i * groupSize
      const end = (i + 1) * groupSize
      const array = dataArray.slice(start, end)
      const average = array.reduce((a, b) => a + b, 0) / groupSize
      averages.push(average)
    }
    const average = Math.max(...averages)
    const averagePercent = average / MAX_VALUE

    const barHeight = maxHeight * averagePercent
    return barHeight
  }

  private createAnalyserContext (audioContext: AudioContext, audioNode: AudioNode, channel: number): AnalyzerContext {
    const analyser = audioContext.createAnalyser()
    analyser.smoothingTimeConstant = this.config.smoothingTimeConstant
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    audioNode.connect(analyser, channel)
    analyser.minDecibels = this.config.minDecibels
    analyser.maxDecibels = this.config.maxDecibels
    return { analyser, dataArray }
  }

  private createAudioContext(): AudioContext {
    if (!this.audioCtx) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    return this.audioCtx
  }
}
