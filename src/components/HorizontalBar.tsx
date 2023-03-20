import React, {CSSProperties} from "react";
import {BaseComponentProps} from "../utils";

export interface HorizontalBarProps extends BaseComponentProps{
  style?: CSSProperties
}

export const HorizontalBar = (props: HorizontalBarProps) => {
  return (
    <div className={`pp-ui pp-ui-row pp-ui-horizontal-bar ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>
  );
}

export default HorizontalBar
