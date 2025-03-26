import React from 'react'

import { useAdCountdown } from '../hooks/hooks'

export const AdCountdown = () => {
  const time = useAdCountdown()
  if (time === null) {
    return null
  }
  const text = `${time} s`
  return (<div className="pp-ui-label pp-ui-ad-countdown-label">{text}</div>)
}
