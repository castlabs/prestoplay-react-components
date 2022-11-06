import React from "react";
import renderer, {act, create, ReactTestRenderer} from 'react-test-renderer';
import PlayPauseButton from "../../src/components/PlayPauseButton";
import Player, {State} from "../../src/Player";
import {classNames, emitPlayerEvent} from "../test_utils";

const SHOWS_PLAY_BUTTON = `
<button
  className="pp-ui pp-ui-button  pp-ui-playpause-toggle pp-ui-playpause-toggle-play "
  onClick={[Function]}
  type="button"
>
  <i
    className="pp-ui pp-ui-icon"
  />
</button>
`

const SHOWS_PAUSE_BUTTON = `
<button
  className="pp-ui pp-ui-button  pp-ui-playpause-toggle pp-ui-playpause-toggle-pause "
  onClick={[Function]}
  type="button"
>
  <i
    className="pp-ui pp-ui-icon"
  />
</button>
`

describe("<PlayPauseButton />", () => {

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  test("should match snapshot", async () => {
    const player = new Player()
    let component = renderer.create(<PlayPauseButton player={player}/>);
    let tree = component.toJSON()
    expect(tree).toMatchInlineSnapshot(SHOWS_PLAY_BUTTON)
  });

  test("should react to state changes", async () => {
    const player = new Player()
    let component!: ReactTestRenderer
    act(() => {
      component = create(<PlayPauseButton player={player}/>);
    });
    expect(classNames(component)).toContain("pp-ui-playpause-toggle-play")
    expect(classNames(component)).not.toContain("pp-ui-playpause-toggle-pause")

    act(() => {
      emitPlayerEvent(player,"statechanged", {
        currentState: State.Playing,
        previousState: State.Paused,
        timeSinceLastStateChangeMS: 0
      })
    })
    expect(classNames(component)).not.toContain("pp-ui-playpause-toggle-play")
    expect(classNames(component)).toContain("pp-ui-playpause-toggle-pause")

  });

  test("should reset rate", async () => {
    const player = new Player()
    let rateSetter = jest.spyOn(player, "rate", "set")
    let component!: ReactTestRenderer
    act(() => {
      component = create(<PlayPauseButton player={player} resetRate={true}/>);
    });

    // go to playing state and change rate
    act(() => {
      emitPlayerEvent(player, "statechanged", {
        currentState: State.Playing,
        previousState: State.Paused,
        timeSinceLastStateChangeMS: 0
      })

      jest.spyOn(player, "rate", "get").mockReturnValue(2)
      emitPlayerEvent(player, "ratechange", 2)
    })

    expect(component.toJSON()).toMatchInlineSnapshot(SHOWS_PLAY_BUTTON)
    // @ts-ignore
    component.toJSON()!.props.onClick()

    expect(rateSetter).toHaveBeenCalledTimes(1)
    expect(rateSetter).toHaveBeenCalledWith(1)
    expect(component.toJSON()).toMatchInlineSnapshot(SHOWS_PLAY_BUTTON)
  });

});
