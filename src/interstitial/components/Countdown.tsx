import React, { useEffect, useRef, useState } from 'react'

type Props = {
  seconds: number
  render?: (seconds: number) =>(JSX.Element | null)
  onDone?: () => any
}

/**
 * Countdown component
 */
const CountDown = React.memo((props: Props) => {
  const [count, setCount] = useState(props.seconds)
  const countRef = useRef(count)

  useEffect(() => {
    const interval = setInterval(() => {
      countRef.current -= 1
      if (countRef.current === 0) {
        clearInterval(interval)
        props.onDone?.()
      } else {
        setCount((c) => c - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (props.render) {
    return props.render(count)
  }

  return (
    <div className="pp-ui-countdown">
      <div className="pp-ui-countdown-count">{count}</div>
    </div>
  )
})

CountDown.displayName = 'CountDown'

export { CountDown }
