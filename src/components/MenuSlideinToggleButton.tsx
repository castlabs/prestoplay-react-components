import React, {useState} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {usePrestoUiEvent} from "../react";

export interface MenuSlideinToggleProps extends BasePlayerComponentButtonProps{
}

export const MenuSlideinToggleButton = (props: MenuSlideinToggleProps) => {
  let [isVisible, setVisible] = useState(false);

  async function toggle(event:React.MouseEvent) {
    setVisible(!isVisible)
    props.player.slideInMenuVisible = !isVisible;
    event.stopPropagation();
  }

  usePrestoUiEvent("slideInMenuVisible", props.player, (visible) => {
    setVisible(visible)
  })

  // @ts-ignore
  return (
    <BaseButton onClick={toggle} disableIcon={false}
                className={`pp-ui-slideinmenu-toggle ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
}

export default MenuSlideinToggleButton
