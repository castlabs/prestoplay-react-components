import React, { useCallback, useContext, useEffect, useRef } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { VolumeMeterService, VuMeterConfig } from '../services/volumeMeterService'

import type { BaseComponentProps } from './types'

export type Props = BaseComponentProps & {
  config?: VuMeterConfig
  width: number
  height: number
}


const mount = (service: VolumeMeterService, canvas: HTMLCanvasElement, config: VuMeterConfig) => {
  service.configure(canvas, config)
  service.mount()
}

/**
 * Volume Unit Meter
 */
export const VuMeter = (props: Props) => {
  const { presto } = useContext(PrestoContext)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const serviceRef = useRef<VolumeMeterService|null>(null)
  const config = props.config ?? {}

  useEffect(() => {
    if (presto) {
      serviceRef.current = new VolumeMeterService(presto)
      if (canvasRef.current) {
        mount(serviceRef.current, canvasRef.current, config)
      }
    }
  }, [presto])


  const onRef = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
    if (serviceRef.current) {
      mount(serviceRef.current, canvas, config)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.unmount()
        serviceRef.current = null
        canvasRef.current = null
      }
    }
  }, [])

  return <canvas
    ref={onRef} style={props.style} className={props.className}
    width={props.width} height={props.height}/>
}
