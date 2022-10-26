import React, {MouseEventHandler} from "react";
import {BaseComponentProps} from "../../utils";

export interface BaseButtonProps extends BaseComponentProps {
  onClick: MouseEventHandler | undefined;
  disableIcon?: boolean
}

const BaseButton = (props: BaseButtonProps) => {
  const generateIcon = () => props.disableIcon ? undefined :
    <i className={"pp-ui pp-ui-icon"}/>

  return (
    <button type="button"
            className={`pp-ui pp-ui-button ${props.className || ''}`}
            onClick={props.onClick}>
      {generateIcon()}
      {props.children}
    </button>
  );
}

export default BaseButton
