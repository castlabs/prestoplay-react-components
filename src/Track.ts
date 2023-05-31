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
export type Track = {
  /**
   * The underlying prestoplay track or null
   * 
   * This is currently set to any because there is a great type
   * conflict caused by ppTrack being either clpp.Track or clpp.Rendition.
   * I am pretty sure a lot of the code will therefore also not work as
   * expected since it is working with different, incompatible data structures.
   * This should be revisited.
   * 
   * The actual current type is something like clpp.Track | clpp.Rendition | null
   */
  ppTrack: any
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

export function getActiveTrack(tm: clpp.TrackManager, type: TrackType): Track {
  // @ts-ignore here is a big type conflict, this should be looked at.
  return fromPrestoTrack(tm, getActivePrestoTrackForType(tm, type), type)
}

export function getActivePrestoTrackForType(tm: clpp.TrackManager, type: string) {
  switch (type) {
    case clpp.Track.Type.AUDIO:
      return tm.getAudioTrack()
    case clpp.Track.Type.TEXT:
      return tm.getTextTrack()
    case clpp.Track.Type.VIDEO: {
      const videoTrack = tm.getVideoTrack()
      if (!videoTrack) {return null}
      if (tm.isAbrEnabled()) {
        return getAbrTrack(tm)
      }
      return tm.getVideoRendition()
    }
  }
  return null
}

export function getPrestoTracksForType(tm: clpp.TrackManager, type: string): clpp.Track[] | clpp.Rendition[] {
  switch (type) {
    case clpp.Track.Type.AUDIO:
      return tm.getAudioTracks()
    case clpp.Track.Type.TEXT:
      return tm.getTextTracks()
    case clpp.Track.Type.VIDEO: {
      const videoTrack = tm.getVideoTrack()
      if (!videoTrack) {return []}
      return videoTrack.renditions
    }
  }
  return []
}

export function getAbrTrack(tm?: clpp.TrackManager): Track {
  return {
    type: 'video',
    label: 'Auto',
    selected: tm?.isAbrEnabled() ?? true,
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

export function fromPrestoTrack(
  tm: clpp.TrackManager,
  ppTrack: clpp.Track | clpp.Rendition,
  type: TrackType,
  active?: clpp.Track | clpp.Rendition | Track | null,
): Track {
  if (!ppTrack) {return getDisabledTrack(type, ppTrack === null)}
  const activeTrack =  active ?? getActivePrestoTrackForType(tm, type)

  return {
    ppTrack,
    selected: !!(activeTrack && activeTrack === ppTrack),
    // @ts-ignore ppTrack could either be a track or a rendition
    // and that causes a type conflict. Not sure how it was intended
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    label: ppTrack.label ?? '',
    // @ts-ignore ppTrack could either be a track or a rendition
    // and that causes a type conflict. Not sure how it was intended
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: ppTrack.type ?? type,
    id: ppTrack.id,
  }
}

export function getTracks(tm: clpp.TrackManager, type: TrackType): Track[] {
  const active = getActivePrestoTrackForType(tm, type)
  const tracksForType = getPrestoTracksForType(tm, type)
  // here eslint wrongly reports an error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return tracksForType.map(track => fromPrestoTrack(tm, track, type, active))
}
