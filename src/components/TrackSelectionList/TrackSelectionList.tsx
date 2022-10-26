import React, {useRef, useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentProps} from "../../utils";

export type TrackType = "video" | "audio" | "text"

export interface TrackSelectionListProps extends BasePlayerComponentProps{
  title: string
  types?: TrackType[]
}

export interface TrackLabelProps {
  onClick: (t: Track) => void
  track: Track
}

interface Track {
  ppTrack: any
  type: "video" | "audio" | "text"
  label: string
  selected: boolean
  id: string
}

const TrackLabel = (props: TrackLabelProps) => {
  async function handleClick() {
    props.onClick(props.track)
  }

  return (
    <div
      className={`pp-ui pp-ui-label pp-ui-label-track pp-ui-label-track-${props.track.selected ? "selected":""}`}
      onClick={handleClick}>
      {props.track.label}
    </div>
  )
}

const TrackSelectionList = (props: TrackSelectionListProps) => {
  let [audioTracks, setAudioTracks] = useState<Track[]>([]);
  let [videoTracks, setVideoTracks] = useState<Track[]>([]);
  let [textTracks, setTextTracks] = useState<Track[]>([]);
  let [playingRenditionHeight, setPlayingRenditionHeightHeight] = useState<number>(-1)
  const trackTypesRef = useRef<TrackType[]>()
  trackTypesRef.current = props.types
  const playingRenditionHeightRef = useRef<number>()
  playingRenditionHeightRef.current = playingRenditionHeight

  const getSupportedTypes = () => {
    let supportedTypes = trackTypesRef.current || ['audio', 'text']
    if (supportedTypes.length == 0) {
      supportedTypes = ['audio', 'text']
    }
    return supportedTypes;
  }

  function updateAudioTracks(tm: any) {
    let tracks = tm.getAudioTracks();
    let active = tm.getAudioTrack();
    setAudioTracks(tracks.map((at: any) => {
      let t: Track = {
        id: at.id,
        ppTrack: at,
        type: "audio",
        label: at.label,
        selected: at === active
      }
      return t
    }))
  }

  function updateTextTracks(tm: any) {
    let tracks = tm.getTextTracks();
    let active = tm.getTextTrack();
    setTextTracks(tracks.map((at: any) => {
      let t: Track = {
        id: at.id,
        ppTrack: at,
        type: "text",
        label: at.label,
        selected: at === active
      }
      return t
    }))
  }

  function updateVideoTracks(tm: any) {
    let track = tm.getVideoTrack()
    if (!track) {
      setVideoTracks([])
      return
    }
    let tracks = track.renditions
    let active = tm.getVideoRendition();
    let abrEnabled = tm.isAbrEnabled()
    let model: Track[] = []
    const getAutoLabel = () => {
      if(!abrEnabled || !playingRenditionHeightRef.current || playingRenditionHeightRef.current <= 0){
        return "Auto"
      }
      return `Auto (${playingRenditionHeightRef.current}p)`
    }
    model.push({
      ppTrack: null,
      selected: abrEnabled,
      id: 'abr',
      label: getAutoLabel(),
      type: 'video'
    })

    model = model.concat(tracks.map((t: any) => {
      let track: Track = {
        id: t.id,
        ppTrack: t,
        type: "video",
        label: `${t.height}p`,
        selected: !abrEnabled && t === active
      }
      return track
    }).sort(((a:any, b:any)=> b.ppTrack.height - a.ppTrack.height)));
    setVideoTracks(model)
  }

  function updateStateFromPlayer(presto: any) {
    let tm = presto.getTrackManager();

    getSupportedTypes().forEach(supportedType => {
      switch (supportedType) {
        case "audio":
          updateAudioTracks(tm)
          break
        case "text":
          updateTextTracks(tm)
          break
        case "video":
          updateVideoTracks(tm)
          break
      }
    })
  }

  usePrestoEvent(clpp.events.TRACKS_ADDED, props.player, (e, presto) => {
    updateStateFromPlayer(presto);
  })
  usePrestoEvent(clpp.events.AUDIO_TRACK_CHANGED, props.player, (e, presto) => {
    updateStateFromPlayer(presto);
  })
  usePrestoEvent(clpp.events.VIDEO_TRACK_CHANGED, props.player, (e, presto) => {
    updateStateFromPlayer(presto);
  })
  usePrestoEvent(clpp.events.BITRATE_CHANGED, props.player, (e, presto) => {
    if (e && e.detail) {
      setPlayingRenditionHeightHeight(e.detail.height)
    } else {
      setPlayingRenditionHeightHeight(-1)
    }
    updateStateFromPlayer(presto);

  })
  usePrestoEvent(clpp.events.TEXT_TRACK_CHANGED, props.player, (e, presto) => {
    updateStateFromPlayer(presto);
  })

  const selectTrack = async (t: Track) => {
    let presto = await props.player.presto()
    let tm = presto.getTrackManager();
    if (t.type == "audio") {
      tm.setAudioTrack(t.ppTrack)
    } else if (t.type == "text") {
      tm.setTextTrack(t.ppTrack)
    } else if (t.type == 'video') {
      if (t.id == "abr") {
        tm.setVideoRendition(null)
      } else {
        tm.setVideoRendition(t.ppTrack, true)
      }
    }
    updateStateFromPlayer(presto)
  }

  const renderLabels = () => {
    let labels: any[] = []
    getSupportedTypes().forEach((type: TrackType) => {
      let tracks = type == "audio" ? audioTracks : (type == "text" ? textTracks : videoTracks)
      labels = labels.concat(tracks.map(t => <TrackLabel key={t.id} track={t}
                                                onClick={selectTrack}/>)
      )
    })
    return labels
  }
  const titleLabel = () => {
    if (props.title) {
      return (<div>{props.title}</div>)
    }
  }

  return (
    <div>
      {titleLabel()}
      {renderLabels()}
    </div>
  );
}

export default TrackSelectionList
