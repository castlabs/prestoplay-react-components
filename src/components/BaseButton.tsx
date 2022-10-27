import React, {MouseEventHandler} from "react";
import {BaseComponentProps} from "../utils";

/**
 * The base button properties
 */
export interface BaseButtonProps extends BaseComponentProps {
  /**
   * The click callback
   */
  onClick?: MouseEventHandler | undefined;
  /**
   * By default, the base button has an icon. If no icon is set, for instance
   * through the css style, use this property to disable icon rendering and
   * turn this into a text based button.
   */
  disableIcon?: boolean
}

/**
 * Basic button that exposes an onClick callback. The base button, by default,
 * assumes that it will have an icon. Of that is not the case, adjust the
 * `disableIcon` property.
 *
 * @param props
 * @constructor
 */
export const BaseButton = (props: BaseButtonProps) => {
  const generateIcon = () => props.disableIcon ? undefined :
    <i className={"pp-ui pp-ui-icon"}/>

  return (
    <button type="button"
            className={`pp-ui pp-ui-button ${props.disableIcon ? 'pp-ui-button-no-icon': ''} ${props.className || ''}`}
            onClick={props.onClick}>
      {generateIcon()}
      {props.children}
    </button>
  );
}

export default BaseButton
