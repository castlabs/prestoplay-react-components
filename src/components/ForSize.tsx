import React from 'react'

import { usePlayerSize } from '../react'

type Props = {
  size: 'xs' | 'small' | 'medium' | 'large'
  children: React.ReactNode
}

const SMALL_START = 350
const MEDIUM_START = 500
const LARGE_START = 1000

/**
 * This component renders it's children according to the current
 * width of the player.
 */
export const ForSize = (props: Props) => {
  const { width } = usePlayerSize()

  if (
    props.size === 'xs'
    || props.size === 'small' && width >= SMALL_START
    || props.size === 'medium' && width >= MEDIUM_START
    || props.size === 'large' && width >= LARGE_START
  ) {
    return <>{props.children}</>
  }

  return null
}
