import {Player} from "./Player";
import React, {MouseEventHandler} from "react";

function pad(str: string, max: number): string {
  return str.length < max ? pad('0' + str, max) : str;
}

function padReplace(value:string) {
  return (_:any, group:string) => pad(value, group.length - 1)
}

export interface BaseComponentProps {
  children?: React.ReactNode
  className?: string
}

export interface BasePlayerComponentProps extends BaseComponentProps {
  player: Player
}

export interface BasePlayerComponentButtonProps extends BasePlayerComponentProps{
  disableIcon?: boolean
}

/**
 * Translates a duration in seconds to a human-readable format.
 *
 * You can use the following format specifiers:
 * <ul>
 * <li><code>%h</code> for Hours</li>
 * <li><code>%m</code> for Minutes</li>
 * <li><code>%s</code> for Seconds</li>
 * </ul>
 *
 * The formatters can be repeated to pad the output.
 * For example, <code>'%m'</code> will return '1' if you pass 60 seconds,
 * while <code>'%mm'</code> will left pad the output and return '01'.
 *
 * @param {number} timeInSeconds The duration in seconds
 * @param {string} [opt_format] The output format
 * @returns {string} The formated duration as a string
 * @export
 */
export function timeToString(timeInSeconds: number, opt_format = '%hh:%mm:%ss') {
  if (timeInSeconds === null || timeInSeconds === undefined) {
    timeInSeconds = 0;
  }
  if (opt_format === null || opt_format === undefined) {
    opt_format = '%h:%mm:%ss';
  }
  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
  let seconds = Math.floor(timeInSeconds - (hours * 3600) - (minutes * 60));

  return opt_format
    .replace(/(%h+)/, padReplace(String(hours)))
    .replace(/(%m+)/, padReplace(String(minutes)))
    .replace(/(%s+)/, padReplace(String(seconds)));
}

export function getMinimalFormat(time:number):string {
  if(time >= 0 && time < 3600) {
    return "%mm:%ss"
  }
  return "%hh:%mm:%ss"
}
