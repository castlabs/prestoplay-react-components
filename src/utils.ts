import {Player} from "./Player";
import React, {CSSProperties} from "react";

/**
 * Base properties for components created by this library
 */
export interface BaseComponentProps {
  /**
   * Optional children that can be passed. If and how they are used depends
   * on the component.
   */
  children?: React.ReactNode
  /**
   * Class name extensions that are passed to the top level element created by
   * a component
   */
  className?: string
  /**
   * Style extensions that are passed to the top level element created by
   * a component
   */
  style?: CSSProperties
}

/**
 * Base interface for component properties that need a player instance
 */
export interface BasePlayerComponentProps extends BaseComponentProps {
  /**
   * The player instance
   */
  player: Player
}

/**
 * Base properties interface for button components that interact with a player.
 */
export interface BasePlayerComponentButtonProps extends BasePlayerComponentProps {
  /**
   * Buttons, by default assume they have an icon. Use this to disable the icon
   * and turn the button into a text based button.
   */
  disableIcon?: boolean
}

/**
 * Small helper that makes it a little easier dealing with a lot of dynamic
 * class names
 * @param classes Record that maps from the class name to a boolean that
 *   indicates if the class will be included in the final classNames string
 * @param classNames Extension that will be appended to the final result if
 *   provided
 */
export function classNames(classes: Record<string, boolean>, classNames?: string): string {
  let selected: string[] = []
  for (let k in classes) {
    if (classes[k]) {
      selected.push(k)
    }
  }
  if (classNames) {
    selected.push(classNames)
  }
  return selected.join(' ')
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

/**
 * Returns the minimal time string based on the provided time
 * @param time
 */
export function getMinimalFormat(time: number): string {
  if (time >= 0 && time < 3600) {
    return "%mm:%ss"
  }
  return "%hh:%mm:%ss"
}

/**
 * Returns the value if it is defined, otherwise returns the specified
 * default value.
 *
 * @param value The value
 * @param defaultValue The default value if value is undefined
 */
export function p(value: any, defaultValue: any) {
  if (value === undefined) return defaultValue
  return value
}

function pad(str: string, max: number): string {
  return str.length < max ? pad('0' + str, max) : str;
}

function padReplace(value: string) {
  return (_: any, group: string) => pad(value, group.length - 1)
}
