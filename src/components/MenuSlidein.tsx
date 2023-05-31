import React, { createRef, useEffect, useState } from 'react'

import { useGlobalHide, usePrestoUiEvent } from '../react'
import { TrackType } from '../Track'
import {
  BasePlayerComponentButtonProps,
  focusNextElement,
  getFocusableElements,
} from '../utils'

import { TrackGroupButton } from './TrackGroupButton'
import { TrackSelectionList } from './TrackSelectionList'

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
 * Track selection menu that is shown as an overlay to the player. If not
 * specified, options for audio, test, and video are rendered in that order
 * using the labels "Language", "Subtitles", and "Quality"
 *
 * @param props
 * @constructor
 */
export const MenuSlidein = (props: MenuSlideinProps) => {
  const [isVisible, setVisible] = useState(props.player.slideInMenuVisible)
  const [audioListVisible, setAudioListVisible] = useState(false)
  const [textListVisible, setTextListVisible] = useState(false)
  const [videoListVisible, setVideoListVisible] = useState(false)
  const ref = createRef<HTMLDivElement>()

  function hide() {
    if (isVisible) {
      props.player.slideInMenuVisible = false
      setVisible(false)
    }
  }

  usePrestoUiEvent('slideInMenuVisible', props.player, (visible) => {
    setVisible(visible)
  })

  useGlobalHide(ref, hide)

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
            label={option.label} player={props.player}
            onClick={()=>setAudioListVisible(!audioListVisible)}
            hideWhenUnavailable={option.hideWhenUnavailable}
            hideCurrentlyActive={option.hideCurrentlyActive}/>
          <TrackSelectionList key={'audio-list'} type={'audio'}
            player={props.player} className={`${audioListVisible ? '' : 'pp-ui-hide'}`}/>
        </div>
      )
      case 'text': return (
        <div key={'text'}>
          <TrackGroupButton key={'text-btn'} type={'text'}
            label={option.label} player={props.player} onClick={()=>setTextListVisible(!textListVisible)}
            hideWhenUnavailable={option.hideWhenUnavailable} hideCurrentlyActive={option.hideCurrentlyActive}/>
          <TrackSelectionList key={'text-list'} type={'text'}
            player={props.player} className={`${textListVisible ? '' : 'pp-ui-hide'}`}/>
        </div>
      )
      case 'video': return (
        <div key={'video'}>
          <TrackGroupButton key={'video-btn'} type={'video'}
            label={option.label} player={props.player}
            onClick={()=>setVideoListVisible(!videoListVisible)}
            hideWhenUnavailable={option.hideWhenUnavailable}
            hideCurrentlyActive={option.hideCurrentlyActive}/>
          <TrackSelectionList key={'video-list'} type={'video'} player={props.player}
            className={`${videoListVisible ? '' : 'pp-ui-hide'}`}/>
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
      ref={ref}
      className={`pp-ui pp-ui-overlay-menu ${isVisible ? 'pp-ui-overlay-menu-visible' : 'pp-ui-overlay-menu-hidden'}`}>
      {renderOptions()}
    </div>
  )
}

export default MenuSlidein
