import React, {CSSProperties} from "react";
import {BaseComponentProps} from "../utils";

export interface SpacerProps extends BaseComponentProps{
  style?: CSSProperties
}

const Spacer = (props: SpacerProps) => {
  return (
    <div className={`pp-ui pp-ui-spacer ${props.className || ''}`} style={props.style}>
      {props.children}
    </div>
  );
}

export default Spacer
