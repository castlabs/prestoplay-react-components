export type SeekRange = {
  start: number
  end: number
}

export type Callback = () => void

/**
 * A timeline cue.
 */
export type Cue = {
  /**
   * Start position as percentage of seek range
   */
  start: number
  /**
   * End position as percentage of seek range
   */
  end: number
  /**
   * If true, the cue should be considered a point, otherwise it is a range.
   */
  isPoint: boolean
}

export type Disposer = () => void

export class El {
  parent: HTMLElement
  children: El[] = []
  disposers: Disposer[] = []

  constructor(parent: HTMLElement) {
    this.parent = parent
  }

  mount() {}

  unmount() {
    this.disposers.forEach(d => d())
    this.disposers = []
    this.children.forEach(c => c.unmount())
    this.children = []
  }

  /**
   * Unmount existing children and mount new children.
   * Registers disposers that run on unmount.
   */
  mountChildren(children: El[]) {
    this.children.forEach(c => c.unmount())
    this.children = []
    this.children = children
    this.children.forEach(c => c.mount())
  }

  /**
   * Append one DOM element under another.
   * Register disposers that run on unmount.
   */
  appendChild(parent: HTMLElement, child: HTMLElement) {
    parent.appendChild(child)
    this.disposers.push(() => {
      parent.removeChild(child)
    })
  }
}
