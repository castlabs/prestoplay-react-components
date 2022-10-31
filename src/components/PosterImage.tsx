import React, {useState} from "react";
import {Player, usePrestoEvent} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {
  BasePlayerComponentProps
} from "../utils";

export interface PosterImageProps extends BasePlayerComponentProps{
  src: string
  alt?: string
}

export const PosterImage = (props: PosterImageProps) => {
  let [visible, setVisible] = useState(!!props.src);
  let [wasHidden, setWasHidden] = useState(false);

  let hasSource = () => !!props.src

  usePrestoEvent(clpp.events.STATE_CHANGED, props.player, async (e, presto) => {
    switch (e.detail.currentState) {
      case clpp.Player.State.IDLE:
        setWasHidden(false)
        wasHidden = false
        setVisible(hasSource() && !wasHidden)
        break
      case clpp.Player.State.PREPARING:
      case clpp.Player.State.BUFFERING:
        if(!hasSource()) {
          setVisible(false)
        } else {
          setVisible(!wasHidden && hasSource())
        }
        break
      case clpp.Player.State.ERROR:
      case clpp.Player.State.PLAYING:
      case clpp.Player.State.PAUSED:
      case clpp.Player.State.ENDED:
        setVisible(false)
        setWasHidden(true)
    }
  }, [wasHidden, visible])

  return (
    <div className={`pp-ui pp-ui-poster-image ${visible && hasSource() ? '': 'pp-ui-poster-image-hidden'}`}>
      <img src={props.src} alt={props.alt}/>
    </div>

  )
}

export default PosterImage
