import React, { useContext, useEffect, useRef, useState } from 'react'

import { PrestoContext } from '../context/PrestoContext'
import { usePrestoUiEvent } from '../react'
import { TrackType } from '../Track'
import {
  focusNextElement,
  getFocusableElements,
} from '../utils'

import { TrackGroupButton } from './TrackGroupButton'
import { TrackSelectionList } from './TrackSelectionList'

import type { BasePlayerComponentButtonProps } from './types'

/**
 * The available selection types
 */
export type SelectionType = TrackType

/**
 * A selection option for a given type that is rendered with
 * the provided label
 */
export interface SelectionOption {
  type: SelectionType
  label: string
  hideCurrentlyActive?: boolean
  hideWhenUnavailable?: boolean
}

export interface MenuSlideinProps extends BasePlayerComponentButtonProps {
  selectionOptions?: SelectionOption[]
}

export const DEFAULT_SELECTION_OPTIONS: SelectionOption[] = [
  { type: 'audio', label: 'Language', hideCurrentlyActive: false, hideWhenUnavailable: true },
  { type: 'text', label: 'Subtitles', hideCurrentlyActive: false, hideWhenUnavailable: true },
  { type: 'video', label: 'Quality', hideCurrentlyActive: false, hideWhenUnavailable: true },
]

/**
 * Menu Slidein.
 * 
 * Track selection menu that is shown as an overlay to the player. If not
 * specified, options for audio, test, and video are rendered in that order
 * using the labels "Language", "Subtitles", and "Quality"
 */
export const MenuSlidein = (props: MenuSlideinProps) => {
  const { player } = useContext(PrestoContext)
  const [isVisible, setVisible] = useState(player.slideInMenuVisible)
  const [audioListVisible, setAudioListVisible] = useState(false)
  const [textListVisible, setTextListVisible] = useState(false)
  const [videoListVisible, setVideoListVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  usePrestoUiEvent('slideInMenuVisible', (visible) => {
    setVisible(visible)
  })

  const options: SelectionOption[] = props.selectionOptions || DEFAULT_SELECTION_OPTIONS

  useEffect(() => {
    const handleTransitionEnd = () => {
      if (isVisible && ref.current) {
        const focusItems = getFocusableElements(ref.current)
        const index = focusItems.indexOf(document.activeElement as HTMLElement)
        if (index < 0 && focusItems.length) {
          focusNextElement(focusItems)
        }
      }
    }

    ref.current?.addEventListener('transitionend', handleTransitionEnd)

    return () => {
      ref.current?.removeEventListener('transitionend', handleTransitionEnd)
    }
  })

  const renderOption = (option: SelectionOption) => {
    switch (option.type) {
      case 'audio': return (
        <div key={'audio'}>
          <TrackGroupButton key={'audio-btn'} type={'audio'}
            label={option.label}
            onClick={()=>setAudioListVisible(!audioListVisible)}
            hideWhenUnavailable={option.hideWhenUnavailable}
            hideCurrentlyActive={option.hideCurrentlyActive}/>
          <TrackSelectionList key={'audio-list'} type={'audio'} className={`${audioListVisible ? '' : 'pp-ui-hide'}`}/>
        </div>
      )
      case 'text': return (
        <div key={'text'}>
          <TrackGroupButton key={'text-btn'} type={'text'}
            label={option.label}
            onClick={()=>setTextListVisible(!textListVisible)}
            hideWhenUnavailable={option.hideWhenUnavailable} hideCurrentlyActive={option.hideCurrentlyActive}/>
          <TrackSelectionList key={'text-list'} type={'text'} className={`${textListVisible ? '' : 'pp-ui-hide'}`}/>
        </div>
      )
      case 'video': return (
        <div key={'video'}>
          <TrackGroupButton key={'video-btn'} type={'video'}
            label={option.label}
            onClick={()=>setVideoListVisible(!videoListVisible)}
            hideWhenUnavailable={option.hideWhenUnavailable}
            hideCurrentlyActive={option.hideCurrentlyActive}/>
          <TrackSelectionList key={'video-list'} type={'video'} className={`${videoListVisible ? '' : 'pp-ui-hide'}`}/>
        </div>
      )
    }
  }

  const renderOptions = () => {
    if (!options || options.length === 0) {return}
    return options.map(renderOption)
  }

  return (
    <div
      data-testid="pp-ui-menu-slidein"
      ref={ref}
      className={`pp-ui pp-ui-overlay-menu ${isVisible ? 'pp-ui-overlay-menu-visible' : 'pp-ui-overlay-menu-hidden'} `
        +`${props.className ?? ''}`}
      style={props.style}
    >
      {renderOptions()}
    </div>
  )
}
