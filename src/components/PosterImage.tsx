import React, {useState} from "react";
import {BasePlayerComponentProps} from "../utils";
import {usePrestoUiEvent} from "../react";
import {State} from "../Player";

export interface PosterImageProps extends BasePlayerComponentProps {
  src: string
  alt?: string
}

export const PosterImage = (props: PosterImageProps) => {
  let [visible, setVisible] = useState(!!props.src);
  let [wasHidden, setWasHidden] = useState(false);

  let hasSource = () => !!props.src

  usePrestoUiEvent("statechanged", props.player, async ({currentState}) => {
    switch (currentState) {
      case State.Idle:
        setWasHidden(false)
        wasHidden = false
        setVisible(hasSource() && !wasHidden)
        break
      case State.Preparing:
      case State.Buffering:
        if (!hasSource()) {
          setVisible(false)
        } else {
          setVisible(!wasHidden && hasSource())
        }
        break
      case State.Error:
      case State.Playing:
      case State.Paused:
      case State.Ended:
        setVisible(false)
        setWasHidden(true)
    }
  }, [wasHidden, visible])

  return (
    <div
      className={`pp-ui pp-ui-poster-image ${visible && hasSource() ? '' : 'pp-ui-poster-image-hidden'}`}>
      <img src={props.src} alt={props.alt}/>
    </div>

  )
}

export default PosterImage
