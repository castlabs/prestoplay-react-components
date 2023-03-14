/**
 * @template T
 */
export class SmartPromise {
  constructor() {
    this.done = false
    /**
     * @type {function(!T)}
     */
    this.resolve = () => {}
    /**
     * @type {function(!Error)}
     */
    this.reject = () => {}

    /**
     * @type {!Promise<!T>}
     */
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })

    this.promise.finally(() => {
      this.done = true
    })
  }

  isDone() {
    return this.done
  }
}
