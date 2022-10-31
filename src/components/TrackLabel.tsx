import React from "react";
// @ts-ignore
import {clpp} from "@castlabs/prestoplay"
import {BaseComponentProps, classNames} from "../utils";
import {Track} from "../Track";


export interface TrackLabelProps extends BaseComponentProps {
  label: string
  selected: boolean
}

export const TrackLabel = (props: TrackLabelProps) => {
  return (
    <div className={classNames({
      'pp-ui': true,
      'pp-ui-label': true,
      'pp-ui-track-label': true,
      'pp-ui-selected': props.selected,
    }, props.className)}>
      {props.label}
    </div>
  )
}

export default TrackLabel
