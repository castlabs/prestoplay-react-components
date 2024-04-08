import React from 'react'

import { Cue } from '../types'

type Props = {
  cues: Cue[]
  duration: number
}

/**
 * Timeline cues
 */
export const SeekBarCues = (props: Props) => {
  const cues = props.cues
  return (
    <div className='pp-ui-seekbar-cues-margin'>
      <div className='pp-ui-seekbar-cues'>
        {cues.map((cue) => {
          const left = (cue.startTime / props.duration) * 100
          return (
            <div key={cue.id} className='pp-ui-seekbar-cue' style={{
              left: `${left}%`,
              width: '2px',
            }}/>
          )
        })}
      </div>
    </div>
  )
}
