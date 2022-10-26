import React, {createContext, createRef, useContext, useEffect} from "react";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import "@castlabs/prestoplay/cl.mse"
import "@castlabs/prestoplay/cl.dash"

import "@castlabs/prestoplay/clpp.styles.css"
import {
  Player
} from "../../Player";

export interface PlayerProps {
  src: string,
  children?: React.ReactNode,
  onPlayer?: (player: any) => void
  player: Player
}

const PlayerSurface = (props: PlayerProps) => {
  const video = createRef<HTMLVideoElement>();
  const container = createRef<HTMLDivElement>();

  useEffect(() => {
    if (video.current) {
      props.player.init(video.current)
    }
  }, [props.player])
  // useEffect(() => {
  //   if(player == null) {
  //     console.log(`Setting up player with state: ${JSON.stringify(playerState)}`)
  //     player = new clpp.Player(video.current)
  //
  //     if (onPlayer) {
  //       onPlayer(1)
  //     }
  //
  //     player.use(clpp.dash.DashComponent);
  //
  //     player.on(clpp.events.STATE_CHANGED, (e: any) => {
  //       let isPlaying = e.detail.currentState == clpp.Player.State.PLAYING
  //       playerState.setPlaying(isPlaying)
  //       console.log(`Player State change. isPlaying: ${playerState.isPlaying}`)
  //     })
  //   }
  // }, [])

  useEffect(() => {
    props.player.load({
      source: props.src,
      muted: true,
      autoplay: true
    })
  }, [props.src, props.player])

  return (
    <div ref={container}>
      <video ref={video}></video>
      <div>
        {props.children}
      </div>
    </div>
  )
}

export default PlayerSurface
