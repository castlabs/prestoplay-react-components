/**
 * Assign a value to a universal React ref
 */
export const setRef = <T>(ref: React.ForwardedRef<T> | undefined, value: T) => {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}
