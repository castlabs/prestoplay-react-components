import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle, useRef,
  useState
} from "react";
import {BasePlayerComponentButtonProps} from "../utils";
import BaseButton from "./BaseButton";
import {
  usePrestoEnabledState,
  usePrestoUiEvent
} from "../react";

export interface SettingsButtonProps extends BasePlayerComponentButtonProps{
}

export const SettingsButton = forwardRef((props: SettingsButtonProps, forwardRef: ForwardedRef<HTMLButtonElement>) => {
  let [isVisible, setVisible] = useState(false);
  let enabled = usePrestoEnabledState(props.player);
  let ref = useRef<HTMLButtonElement>(null);

  async function toggle(event:React.MouseEvent) {
    setVisible(!isVisible)
    props.player.slideInMenuVisible = !isVisible;
    event.stopPropagation();
    event.preventDefault()
    if (ref.current && !isVisible) {
      ref.current.blur()
    }
  }

  usePrestoUiEvent("slideInMenuVisible", props.player, (visible) => {
    setVisible(visible)
  })

  useImperativeHandle(forwardRef, () => {
    return ref.current!
  }, [ref])

  // @ts-ignore
  return (
    <BaseButton onClick={toggle} disableIcon={false} disabled={!enabled} ref={ref}
                className={`pp-ui-settings-button ${props.className || ''}`}>
      {props.children}
    </BaseButton>
  );
})

export default SettingsButton
