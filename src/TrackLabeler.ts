import { LanguageCodes } from './LanguageCodes'
import { Player } from './Player'
import { Track } from './Track'

/**
 * Base interface for track labeler functions
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrackLabelerOptions {}

/**
 * A track labeler is a function that receives a track, the player, and some
 * options and returns a label for the track.
 */
export type TrackLabeler = (track: Track, player: Player, options?: TrackLabelerOptions) => string
/**
 * The track sorter is used to sort track lists
 */
export type TrackSorter = (a: Track, b: Track) => number

/**
 * The default track labeler options
 */
export interface DefaultTrackLabelerOptions extends TrackLabelerOptions {
  /**
   * If true, the currently playing rendition quality rendered as `<height>p`
   * is added to the ABR label for video tracks when the player is in ABR mode
   */
  usePlayingRenditionInAbrLabel?: boolean
  /**
   * We are translating language tags, i.e. 'de', by default ot the english
   * name, i.e. 'German'. With this option set to true, the native language name
   * will be used instead, i.e. 'Deutsch'
   */
  useNativeLanguageNames?: boolean
  /**
   * The label that is used for ABR tracks, defaults to 'Auto'
   */
  abrLabel?: string
  /**
   * The labels that is used for disabled track, defaults to 'Off'
   */
  disabledTrackLabel?: string
  /**
   * The label that is used for unknown tracks, defaults to 'Unknown'
   */
  unknownTrackLabel?: string
  /**
   * If defined, the bitrate is shown for video tracks in the chosen units.
   */
  showVideoBitrate?: 'Mbps'
}

/**
 * The default track labeler
 *
 * @param t The track
 * @param player The player
 * @param _options Labeler options
 */
export const defaultTrackLabel: TrackLabeler = (t: Track, player: Player, _options?: DefaultTrackLabelerOptions) => {
  const opts = _options || {
    usePlayingRenditionInAbrLabel: false,
    useNativeLanguageNames: false,
  }

  opts.abrLabel = opts.abrLabel || 'Auto'
  opts.disabledTrackLabel = opts.disabledTrackLabel || 'Off'
  opts.unknownTrackLabel = opts.unknownTrackLabel || 'Unknown'

  if (t.id === 'abr') {
    if (!player.playingVideoTrack ||
      !player.playingVideoTrack.ppTrack ||
      !player.playingVideoTrack.ppTrack.height ||
      !opts.usePlayingRenditionInAbrLabel) {
      return opts.abrLabel
    } else {
      return `${opts.abrLabel} (${player.playingVideoTrack.ppTrack.height}p)`
    }
  }

  if (!t.ppTrack) {
    return opts.disabledTrackLabel
  }

  if (t.type === 'video') {
    if (!t.ppTrack.height) {
      return opts.unknownTrackLabel
    }

    let result = `${t.ppTrack.height}p`

    if (opts.showVideoBitrate === 'Mbps' && t.ppTrack.bandwidth) {
      result += ` (${(t.ppTrack.bandwidth / 1048576).toFixed(1)} Mbps)`
    }

    return result
  } else {
    if (t.label) {
      return t.label
    }
    if (t.ppTrack.language) {
      // @ts-ignore
      const lang = LanguageCodes[t.ppTrack.language]
      if (lang) {
        if (opts.useNativeLanguageNames) {
          return lang.native
        }
        return lang.name
      }
    }

    const trackList = player[`${t.type}Tracks`]
    const i = trackList.indexOf(t)
    if (i >= 0 && trackList.length > 1) {
      return `${opts.unknownTrackLabel}`
    }
    return `${opts.unknownTrackLabel}`
  }
}

/**
 * The default track sorter sorts by height, label, and language
 *
 * @param a
 * @param b
 */
export const defaultTrackSorter: TrackSorter = (a: Track, b: Track) => {
  if (!a.ppTrack) {return -1}
  if (!b.ppTrack) {return 1}
  if (a.ppTrack.height && b.ppTrack.height) {
    return b.ppTrack.height - a.ppTrack.height
  }
  if (a.label && b.label) {
    return a.label.localeCompare(b.label)
  }
  if (a.ppTrack.language && b.ppTrack.language) {
    return a.ppTrack.language.localeCompare(b.ppTrack.language)
  }
  return 0
}
