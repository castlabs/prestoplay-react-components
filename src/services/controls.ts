export type ControlsVisibilityMode = 'auto' | 'always' | 'never'

type Callback = (visible: boolean) => void

const AUTO_HIDE_DELAY_MS = 3_000

export class Controls {
  public onChange: Callback = () => {}
  public hideDelayMs = AUTO_HIDE_DELAY_MS

  private hideTimeout: ReturnType<typeof setTimeout> | null = null
  private _visible = false
  private isPinned = false
  private _mode: ControlsVisibilityMode = 'auto'

  get mode() {
    return this._mode
  }

  set mode(mode: ControlsVisibilityMode) {
    this._mode = mode
    if (mode === 'always') {
      this._show()
    } else if (mode === 'never') {
      this._hide()
    }
  }

  get visible() {
    return this._visible
  }

  /**
   * Show controls and keep them visible until a call to `unpin()`
   */
  pin() {
    if (this.mode !== 'auto' || this.isPinned) {return}

    this._show()
    this.isPinned = true
  }

  /**
   * Cancel the effect of a `pin()` call and go back to auto-hiding
   */
  unpin() {
    if (this.mode !== 'auto' || !this.isPinned) {return}

    this.isPinned = false
    this.autoHide()
  }

  show() {
    if (this.mode !== 'auto' || this.isPinned || this.visible) {return}

    this._show()
    this.autoHide()
  }

  hide() {
    if (this.mode !== 'auto' || this.isPinned || !this.visible) {return}

    this._hide()
  }

  setVisible(visible: boolean) {
    if (visible) {
      this.show()
    } else {
      this.hide()
    }
  }

  private _hide() {
    this.clearTimeout()
    this._visible = false
    this.onChange(false)
  }

  private _show() {
    this.clearTimeout()
    this._visible = true
    this.onChange(true)
  }

  private autoHide() {
    this.hideTimeout = setTimeout(() => {
      this.hide()
      this.hideTimeout = null
    }, this.hideDelayMs)
  }

  private clearTimeout() {
    if (this.hideTimeout == null) {return}

    clearTimeout(this.hideTimeout)
    this.hideTimeout = null
  }
}
