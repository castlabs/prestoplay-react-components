import React, { useState } from 'react'

import { State } from '../Player'
import { usePrestoUiEvent } from '../react'

import type { BaseComponentProps } from './types'

export interface PosterImageProps extends BaseComponentProps {
  /**
   * Poster image source URL.
   */
  src: string
  /**
   * Alternative description of the image.
   */
  alt?: string
}

/**
 * Poster image.
 * An initial image intended to be displayed as a backdrop before video started
 * loading or while it is being fetched and loaded.
 */
export const PosterImage = (props: PosterImageProps) => {
  const [visible, setVisible] = useState(!!props.src)
  const [wasHidden, setWasHidden] = useState(false)

  const hasSource = props.src != null

  usePrestoUiEvent('statechanged', ({ currentState }) => {
    switch (currentState) {
      case State.Idle:
        setWasHidden(false)
        setVisible(!wasHidden && hasSource)
        break
      case State.Preparing:
      case State.Buffering:
        if (hasSource) {
          setVisible(!wasHidden)
        } else {
          setVisible(false)
        }
        break
      case State.Error:
      case State.Playing:
      case State.Paused:
      case State.Ended:
        setVisible(false)
        setWasHidden(true)
    }
  }, [wasHidden, hasSource])

  return (
    <div
      data-testid="pp-ui-poster-image" 
      className={`pp-ui pp-ui-poster-image ${(visible && hasSource) ? '' : 'pp-ui-poster-image-hidden'} `
        +`${props.className ?? ''}`}
      style={props.style}
    >
      <img src={props.src} alt={props.alt}/>
    </div>
  )
}
