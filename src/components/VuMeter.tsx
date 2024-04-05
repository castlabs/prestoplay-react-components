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
  return null
}
