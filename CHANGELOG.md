# 0.8.3 (Beta)

## New Features

* Add option to keep player controls hidden.
* Make `BaseThemeOverlay` more configurable:
  * Add option to hide buttons (audio, full screen, track options)
  * Add option to hide the top bar of player controls
  * Add option to render a companion component above the bottom bar
    of player controls
* Add option to display cues on the seek bar

## Fixes

* Fix rounding of duration.
* Fix UI interaction on mobile platforms.

# 0.7.3 (Beta)

## Fixes

* Show UI controls on mouse move.
* Add basic keyboard shortcuts (Fast-forward, Rewind, Pause/Play).

# 0.7.2 (Beta)

## Fixes

* Fix styling of video canvas.

# 0.7.1 (Beta)

## Fixes

* Make sure the default entry point is ESM (this helps prevent [Webpack issue 4674](https://github.com/webpack/webpack/issues/4674)).

# 0.7.0 (Beta)

## Breaking changes

* Removed `showWhenDisabled` props from `PlayerControls`, it is no longer meaningful after the recent changes
  to controls visibility. Now controls are always visible when video is paused or idle.
* Removed the `player` prop from all components (except `PlayerSurface`). Instead of it, all components should
  be descendants of `PlayerSurface` and this way they get access to the `player` instance from its context. 
  ```jsx
      <PlayerSurface player={player}>
          <BaseThemeOverlay/>
      </PlayerSurface>
  ```
  To access the values from the context directly use `PrestoContext`.
  ```jsx
  import { PrestoContext } from "@castlabs/prestoplay-react-components"

  // descendant of PlayerSurface
  const UiComponent = () => {
    const { player, presto } = useContext(PrestoContext)
  }
  ```
* Changes to hooks:
  * Hooks `usePrestoCoreEvent`, `usePrestoUiEvent` no longer accept the `player` argument, instead they
  should be wrapped with `PlayerSurface` (or `PrestoContext`).
  * Removed the `usePresto`. You can use `PrestoContext` instead to access the PRESTOplay instance.
    ```jsx
    import { PrestoContext } from "@castlabs/prestoplay-react-components"

    const useMyHook = () => {
      const { presto } = useContext(PrestoContext)
    }
    ```
  * Removed the `useGlobalHide` hook.
  * Hooks `usePrestoEnabledState`, `usePrestoEnabledStateClass` should be wrapped with `PlayerSurface`
  (or `PrestoContext`), in which case it is not necessary to pass the `player` argument anymore.
* `HoverContainer` no longer accepts props `listenToHover` and `notTrackFullWidth`.

## New Features

* VU Meter component.

## Fixes

* Fixes to `BaseThemeOverlay`:
  * Before start of playback make sure `CurrentTime` displays a valid value of `0:00`.
  * Make sure seek bar is visible.
  * Improve responsiveness of the UI.
* Improve positioning by `HoverContainer`.
* All components now accept `style` and `className` prop and apply them to their top-most element.
* Removed `children` prop from components that do not render any child components.
* Fix `Duration` to display the correct value even when it is rendered after the video has been loaded.

## Changes

* Player controls auto-hide after 3s instead of 5s.
* Added `mode` prop to `PlayerControls` which can be used to configure the visibility of player controls.

# 0.6.0 (Beta)

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

* Update `@castlabs/prestoplay` to v6.2.7.
* Add options to disable or hide seek bar.
  * Add `SeekBar.enabled` prop to disable seek bar.
  * Add `BaseThemeOverlay.seekBar` prop that can be configure with `'enabled' | 'disabled' | 'none'` to enable,
    disable or the hide seek bar.
* Add `Player.trackLabelerOptions.showVideoBitrate` option to configure track selection UI. This is useful for videos
  which have multiple qualities of same resolution but at different bitrates.
* Fix an issue with `BufferingIndicator` where it was not visible.
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

# 0.5.0 (Beta)

The first public release.

