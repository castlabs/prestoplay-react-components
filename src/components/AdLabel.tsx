import React, { useContext } from 'react'

import { PrestoContext } from '../context/PrestoContext'

export const AdLabel = () => {
  const { player } = useContext(PrestoContext)

  if (!player.ad) {
    return null
  }

  return (
    <div className="pp-ui-ad-label">
      <div>Ad</div>
      <div className="pp-ui-circle"></div>
      <div>{player.ad.podOrder}/{player.ad.podCount}</div>
    </div>
  )
}
