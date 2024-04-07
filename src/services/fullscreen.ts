/* eslint-disable
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/ban-ts-comment
*/

const ENTER = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen',
  'webkitEnterFullscreen',
]

const EXIT = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen',
  'webkitExitFullscreen',
]

const EVENT = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange',
  'webkitbeginfullscreen',
  'webkitendfullscreen',
]

/**
 * Find and return the first method out of the choices,
 * which is available on the element.
 */
const findApiMethod = (element: HTMLElement | Document, choices: string[]) => {
  const methodName = choices.find(name => {
    // @ts-ignore
    return typeof element[name] === 'function'
  })

  if (methodName) {
    // @ts-ignore
    return () => element[methodName]()
  } else {
    return null
  }
}

/**
 * Cross-browser fullscreen API
 */
export const fullscreen = {
  isSupported: () => {
    return document.fullscreenEnabled ??
      // @ts-ignore
      document.mozFullscreenEnabled ??
      // @ts-ignore
      document.webkitFullscreenEnabled ??
      // @ts-ignore
      document.msFullscreenEnabled
  },
  element: () => {
    return document.fullscreenElement ??
      // @ts-ignore
      document.webkitFullscreenElement ??
      // @ts-ignore
      document.webkitCurrentFullScreenElement ??
      // @ts-ignore
      document.mozFullScreenElement ??
      // @ts-ignore
      document.msFullscreenElement
  },
  isInFullscreen: () => {
    return fullscreen.element() != null ||
      // @ts-ignore
      document.webkitDisplayingFullscreen === true
  },
  exit: () => {
    findApiMethod(document, EXIT)?.()
  },
  enter: (element: HTMLElement) => {
    findApiMethod(element, ENTER)?.()
  },
  canEnter: (element: HTMLElement) => {
    return findApiMethod(element, ENTER) != null
  },
  toggle: (element: HTMLElement) => {
    if (fullscreen.isInFullscreen()) {
      fullscreen.exit()
    } else {
      fullscreen.enter(element)
    }
  },
  /**
   * @param element 
   * @param callback listener to fullscreen change on `element` 
   * @returns disposer
   */
  addListener: (element: HTMLElement | Document, callback: () => void) => {
    EVENT.forEach(name => {
      element.addEventListener(name, callback)
    })

    return () => {
      EVENT.forEach(name => {
        element.removeEventListener(name, callback)
      })
    }
  },
}
