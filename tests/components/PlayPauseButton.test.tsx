import React from "react";
import renderer from 'react-test-renderer';
// import Player from "../../src/Player";
import PlayPauseButton from "../../src/components/PlayPauseButton";

describe("<PlayPauseButton />", () => {

  test("should have the play pause toggle style", async () => {
    const player = {} as any
    let component = renderer.create(<PlayPauseButton player={player}/>);
    let tree = component.toJSON()
  });

});
