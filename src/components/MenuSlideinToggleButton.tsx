import React, {createRef, useState} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {
  usePrestoEnabledState,
  usePrestoEnabledStateClass,
  usePrestoUiEvent
} from "../react";

export interface MenuSlideinToggleProps extends BasePlayerComponentButtonProps{
}

export const MenuSlideinToggleButton = (props: MenuSlideinToggleProps) => {
  let [isVisible, setVisible] = useState(false);
  let enabled = usePrestoEnabledState(props.player);
  let ref = createRef<HTMLButtonElement>();

  async function toggle(event:React.MouseEvent) {
    setVisible(!isVisible)
    props.player.slideInMenuVisible = !isVisible;
    event.stopPropagation();
    if (ref.current && !isVisible) {
      ref.current.blur()
    }
  }

  usePrestoUiEvent("slideInMenuVisible", props.player, (visible) => {
    setVisible(visible)
  })

  // @ts-ignore
  return (
    <BaseButton onClick={toggle} disableIcon={false} disabled={!enabled} ref={ref}
                className={`pp-ui-slideinmenu-toggle ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default MenuSlideinToggleButton
