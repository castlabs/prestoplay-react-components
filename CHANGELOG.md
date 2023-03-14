# 0.6.0

## Breaking changes

* Moved hooks `usePrestoCoreEvent`, `usePrestoUiEvent`, `usePresto` to a different subfolder. This will only affect
  you if you are using subfolder imports.
  
    ```js
    // Instead if this import
    import { usePrestoCoreEvent, usePrestoUiEven, usePresto } from '@castlabs/prestoplay-react-components/Player';
    // Use this import:
    import { usePrestoCoreEvent, usePrestoUiEvent, usePresto } from '@castlabs/prestoplay-react-components/react';
    ```
* Removed `usePrestoEvent` hook. It has been renamed to `usePrestoCoreEvent`. Note, that the use
  of the more high-level hook `usePrestoUiEvent` is preferred whenever possible over `usePrestoCoreEvent`.
* Removed `Player.on/off/one()` methods. Use `usePrestoCoreEvent` hook to listen
  to `Player` events instead. Alternatively, for you can use:

    ```js
    const prestoPlayer = await Player.presto()
    prestoPlayer.on('event', () => {})
    prestoPlayer.off('event')
    ```
* Removed `Player.use()` method. Use the initializer callback passed to the constructor
  instead.
  
    e.g.:
    ```js
    new Player((pp:any) => {
      pp.use(clpp.dash.DashComponent);
      pp.use(clpp.hls.HlsComponent);
    })
    ```
* Removed `StartButton.config` props. Instead, the `PlayerSurface` now has the 
  option to configure if the `config` passed to it should be loaded immediately or not
  via the `PlayerSurface.autoload` prop.
  If `autoload` is set to false, the passed config will be cached but only applied with
  a call to `Player.load()` or after setting `Player.playing = true`.

## Improvements and fixes

* Extend `BaseThemeOverlay.startButton` prop. Now it can be passed a config object `{ onClick?: () => Promise<void> }`
  which can override the default on-click behavior.
* For `StartButton`
  * Fix styles.
  * Fix issue where it blocks interaction with any other player controls.
* Fix animation of player controls and side menu (slide-in).
* Fix an issue where Escape key press brings up player controls.
* For `PlayerSurface`
  * Add `PlayerSurface.playsInline` prop to be used on mobile or iPad. It configures whether
    player will automatically go to full-screen mode when playback starts or not.
  * Add `PlayerSurface.baseConfig` prop to pass initial configuration to PRESTOplay player. (#3)

    e.g.:
    ```jsx
    <PlayerSurface player={player} baseConfig={{ license: "..." }} />
    ```
  * Fix an issue where event listeners were not being properly detached from the underlying
  video element on unmount.
  * Fix an error occurring when `PlayerSurface.config` is undefined.
* Add a lot of API-level documentation to the modules.
* Add shortcut getters and setters to `Player`.
  * `position` (read/write) Use this setter to seek.
  * `volume` (read/write).
  * `muted` (read/write).
  * `live` (read only).
  * `rate` (read/write).
  * `playing` (read/write).
  * `seekRange` (read only).
  * `state` (read only).
* Fix seeking logic and avoid unnecessary seeking in a situation where seek is being called repeatedly
  in a short period of time.
* Improve support for touch screens and touch vs mouse interaction.
* Fix `FullscreenButton` behaviour on iOS devices. Now it by default ignores the `fullscreenContainer`
  props on iOS and displays video element in fullscreen instead.
* Fix issue with the default labeler with some HLS content tracks. Now video tracks
  that do not expose a size are excluded.

## New Features

* Add support for keyboard control. Use up/down arrow to switch between UI controls, left/right to use sliders, Enter
  to accept and Escape to go back.
* Add `MuteButton` component intended to mute audio.
* Add `HoverContainer` component intended for displaying thumbnails when hovering over the seek bar.
* Disable buttons, sliders and other components or hide them when the player is not in an "OK"/"enabled" state.
  The player is considered to be in an enabled state e.g. when it is playing and it is not considered
  to be in an enabled state e.g. when it is idle or stopped due to an error.
  Changes to this state can be subscribed to via `Player.onUIEvent('enabled', ...)` and the current
  value can be retrieved using `Player.enabled`.
* Add `useVideoElementForFullscreen` prop to the `FullscreenButton`, which allows configuration of whether
  video element should be displayed in fullscreen mode instead of `fullscreenContainer`.
* Add platform specific `pp-ui-ipad` CSS class to the player controls, overlay and player surface
  on iPadOS platform.

# 0.5.0

The first public release.

