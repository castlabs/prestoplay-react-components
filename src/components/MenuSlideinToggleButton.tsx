import React, {useState} from "react";
import {
  Player,
  usePresto,
  usePrestoEvent,
  usePrestoUiEvent
} from "../Player";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";

export interface MenuSlideinToggleProps extends BasePlayerComponentButtonProps{
}

const MenuSlideinToggleButton = (props: MenuSlideinToggleProps) => {
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
