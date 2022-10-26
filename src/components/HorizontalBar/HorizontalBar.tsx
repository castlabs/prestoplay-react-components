import React, {useState} from "react";
import {Player, usePrestoEvent} from "../../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"

export interface HorizontalBarProps {
  children?: React.ReactNode,
}

const HorizontalBar = (props: HorizontalBarProps) => {
  return (
    <div className={"pp-ui pp-ui-horizontal-bar"}>
      {props.children}
    </div>
  );
}

export default HorizontalBar
