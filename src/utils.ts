/**
 * Small helper that makes it a little easier dealing with a lot of dynamic
 * class names
 * @param classes Record that maps from the class name to a boolean that
 *   indicates if the class will be included in the final classNames string
 * @param classNames Extension that will be appended to the final result if
 *   provided
 */
export function classNames(classes: Record<string, boolean>, classNames?: string): string {
  const selected: string[] = []
  for (const k in classes) {
    if (classes[k]) {
      selected.push(k)
    }
  }
  if (classNames) {
    selected.push(classNames)
  }
  return selected.join(' ')
}

/**
 * Translates a duration in seconds to a human-readable format.
 *
 * You can use the following format specifiers:
 * <ul>
 * <li><code>%h</code> for Hours</li>
 * <li><code>%m</code> for Minutes</li>
 * <li><code>%s</code> for Seconds</li>
 * </ul>
 *
 * The formatters can be repeated to pad the output.
 * For example, <code>'%m'</code> will return '1' if you pass 60 seconds,
 * while <code>'%mm'</code> will left pad the output and return <code>01</code>.
 *
 * @param {number} timeInSeconds The duration in seconds
 * @param {string} [opt_format] The output format
 * @param {number} [roundingMargin] this margin allows for smarter rounding.
 *   For example, if we use precision of seconds and the `timeInSeconds` value
 *   is 6.99, it would be rounded to 6. This can be ameliorated by setting a
 *   `roundingMargin` which is added to `timeInSeconds` before rounding in order
 *   to produce a more accurate result of 7.
 * @returns {string} The formatted duration as a string
 * @export
 */
export function timeToString(timeInSeconds: number, opt_format = '%hh:%mm:%ss', roundingMargin = 0.0) {
  if (timeInSeconds === null || timeInSeconds === undefined) {
    timeInSeconds = 0
  }
  if (opt_format === null || opt_format === undefined) {
    opt_format = '%h:%mm:%ss'
  }
  timeInSeconds = timeInSeconds + roundingMargin
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60)
  const seconds = Math.floor(timeInSeconds - (hours * 3600) - (minutes * 60))

  return opt_format
    .replace(/(%h+)/, padReplace(String(hours)))
    .replace(/(%m+)/, padReplace(String(minutes)))
    .replace(/(%s+)/, padReplace(String(seconds)))
}

/**
 * Returns the minimal time string based on the provided time
 * @param time
 */
export function getMinimalFormat(time: number): string {
  if (time >= 0 && time < 3600) {
    return '%mm:%ss'
  }
  return '%hh:%mm:%ss'
}

function pad(str: string, max: number): string {
  return str.length < max ? pad('0' + str, max) : str
}

function padReplace(value: string) {
  return (_: string, group: string) => pad(value, group.length - 1)
}

export function getFocusableElements(parent: HTMLElement): HTMLElement[] {
  const focusQuery = 'a:not([disabled]):not([style*="display:none"]), '
    + 'button:not([disabled]):not([style*="display:none"]), '
    + 'input[type=text]:not([disabled]):not([style*="display:none"]), '
    + '[tabindex]:not([disabled]):not([tabindex="-1"]):not([style*="display:none"])'
    
  const items: HTMLElement[] = Array.from(parent.querySelectorAll(focusQuery)) 
  return items
    .filter(el => {
      return (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement)
      && (el.offsetParent !== null && getComputedStyle(el).display !== 'none' && !el.classList.contains('pp-ui-disabled'))
    })
}

export function focusNextElement(items: HTMLElement[]) {
  let index = -1
  if (document.activeElement) {
    index = items.indexOf(document.activeElement as HTMLElement)
  }
  index = index === -1 ? 0 : index + 1
  if (index >= items.length) {
    index = 0
  }
  focusElement(items[index])
}

export function focusPreviousElement(items: HTMLElement[]) {
  let index = -1
  if (document.activeElement) {
    index = items.indexOf(document.activeElement as HTMLElement)
  }

  index = index === -1 ? items.length - 1 : index - 1
  if (index < 0) {
    index = items.length - 1
  }
  focusElement(items[index])
}

let focusElementTimerId_: ReturnType<typeof setTimeout> | null = null

export function focusElement(item: HTMLElement) {
  if (focusElementTimerId_) {
    clearTimeout(focusElementTimerId_)
    focusElementTimerId_= null
  }

  if (document.activeElement === item) {
    return
  }

  item.focus()

  if (document.activeElement !== item) {
    focusElementTimerId_ = setTimeout(() => {
      focusElement(item)
    }, 64)
  }
}

export function isTouchDevice() {
  return 'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Number(navigator.msMaxTouchPoints) > 0
}

export function isIOS() {
  if (/iPhone|iPod/.test(navigator.platform)) {
    return true
  } else {
    return !isIpadOS() && navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2 &&
      /MacIntel/.test(navigator.platform)
  }
}

export function isIpadOS() {
  return navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform)
}
