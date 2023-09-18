import React, { useCallback, useContext, useEffect, useRef } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { VolumeMeterService, VuMeterConfig } from '../services/volumeMeterService'

import type { BaseComponentProps } from './types'

export type Props = BaseComponentProps & {
  config?: VuMeterConfig
  width: number
  height: number
}

/**
 * Volume Unit Meter
 */
export const VuMeter = (props: Props) => {
  const ctx = useContext(PrestoContext)
  const serviceRef = useRef(new VolumeMeterService(ctx.presto))

  const onRef = useCallback((canvas: HTMLCanvasElement) => {
    serviceRef.current.configure(canvas, props.config ?? {})
    serviceRef.current.mount()
  }, [])

  useEffect(() => {
    return () => {
      serviceRef.current.unmount()
    }
  }, [])

  return <canvas ref={onRef} style={props.style} className={props.className} width={props.width} height={props.height}/>
}
