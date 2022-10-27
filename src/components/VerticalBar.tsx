import React, {CSSProperties} from "react";
import {BaseComponentProps} from "../utils";

export interface VerticalBarProps extends BaseComponentProps{
  style?: CSSProperties
}

const VerticalBar = (props: VerticalBarProps) => {
  return (
    <div className={`pp-ui pp-ui-vertical-bar ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>
  );
}

export default VerticalBar
