import { clpp } from '@castlabs/prestoplay'

/**
 * Track types that are exposed to the UI
 */
export type TrackType = 'video' | 'audio' | 'text'

/**
 * The available track ids. This is a string that are receive from presto, but
 * we have some dedicated ID to identify specific tracks
 */
export type TrackId =
  'abr' |
  'video-unavailable' |
  'audio-unavailable' |
  'text-unavailable' |
  'video-off' |
  'audio-off' |
  'text-off' |
  string

/**
 * UI Track that wraps around a presto player track but is very focused on the
 * UI related information.
 *
 * We are also not using "null" tracks in the interface but rater dedicated
 * tracks for ABR selections or disabled tracks.
 */
export interface Track {
  /**
   * The underlying prestoplay track or null
   * @see {@link https://demo.castlabs.com/#/docs?q=clpp.Track}
   * 
   * TODO This was described as PRESTOplay Track (with type any) but it is being accessed, at least
   * in some places, as clpp.Rendition. So which type should really be here??
   */
  ppTrack: clpp.Track | null
  /**
   * The track type
   */
  type: TrackType
  /**
   * The label of this track
   */
  label: string
  /**
   * True if the track is currently selected
   */
  selected: boolean
  /**
   * The unique ID of this track
   */
  id: TrackId
}

export function getActiveTrack(presto: any, type: TrackType): Track {
  return fromPrestoTrack(presto, getActivePrestoTrackForType(presto.getTrackManager(), type), type)
}

export function getActivePrestoTrackForType(trackManager: any, type: string): any {
  switch (type) {
    case clpp.Track.Type.AUDIO:
      return trackManager.getAudioTrack()
    case clpp.Track.Type.TEXT:
      return trackManager.getTextTrack()
    case clpp.Track.Type.VIDEO: {
      const videoTrack = trackManager.getVideoTrack()
      if (!videoTrack) {return null}
      if (trackManager.isAbrEnabled()) {
        return getAbrTrack(trackManager)
      }
      return trackManager.getVideoRendition()
    }
  }
}

export function getPrestoTracksForType(trackManager: any, type: string): any {
  switch (type) {
    case clpp.Track.Type.AUDIO:
      return trackManager.getAudioTracks()
    case clpp.Track.Type.TEXT:
      return trackManager.getTextTracks()
    case clpp.Track.Type.VIDEO: {
      const videoTrack = trackManager.getVideoTrack()
      if (!videoTrack) {return []}
      return videoTrack.renditions
    }
  }
}

export function getAbrTrack(trackManager?: any): Track {
  return {
    type: 'video',
    label: 'Auto',
    selected: trackManager ? trackManager.isAbrEnabled() : true,
    id: 'abr',
    ppTrack: null,
  }
}

export function getDisabledTrack(type: TrackType, selected: boolean): Track {
  return {
    type: type,
    label: 'Off',
    selected: selected,
    id: `${type}-off`,
    ppTrack: null,
  }
}

export function getUnavailableTrack(type: TrackType): Track {
  return {
    type: type,
    label: 'Unavailable',
    selected: true,
    id: `${type}-unavailable`,
    ppTrack: null,
  }
}

export function fromPrestoTrack(presto: any, ppTrack: any, type: TrackType, active?:Track): Track {
  if (!ppTrack) {return getDisabledTrack(type, ppTrack === null)}
  const tm = presto.getTrackManager()
  active = active || getActivePrestoTrackForType(tm, type)
  return {
    ppTrack,
    selected: !!(active && active == ppTrack),
    label: ppTrack.label,
    type: ppTrack.type || type,
    id: ppTrack.id,
  }
}

export function getTracks(presto: any, type: TrackType): Track[] {
  const tm = presto.getTrackManager()
  const active = getActivePrestoTrackForType(tm, type)
  const tracksForType = getPrestoTracksForType(tm, type)
  return tracksForType
    .map((t: any) => fromPrestoTrack(presto, t, type, active))
}
