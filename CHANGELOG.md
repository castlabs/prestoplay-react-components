# 0.6.0

## Breaking changes

* Moved the react hooks, `usePrestoCoreEvent`, `usePrestoUiEvent`, `usePresto` to
  a dedicated `react` module. This will only affect you if you are using
  individual module imports.
  We decided to go this route to keep the `Player` module as much as possible
  independent of the react implementation.
* Renamed `usePresoEvent` to `usePresoCoreEvent` since we wanted to make it very
  explicit that using this event will hook against the core. While this might be
  needed in some cases, it should generally be avoided and one should try to use
  `usePrestoUiEvent` instead.
* Removed the `on`, `off`, `one` wrapper methods from the `Player` module. They were
  used to add core listeners to the player once initialized. This should be done now
  using the `usePrestoCoreEvent` hook. Alternatively, for instance outside a component,
  you can use `await player.presto()` to get an instance of the core.
* Removed the `use` wrapper from the player. Instead, use the initializer function
  that can be passed to the `Player` constructor. This is more explicit, provided
  better timing (the order of execution is clear, and we wait for the initializer to
  complete before we use the player core) and simplifies the player wrapper.
* The `StartButton` does no longer receive the start config. Instead, the `PlayerSurface` now has the 
  option to configure if the passed configuration should be loaded or not. If `autoload` is set to false, 
  the passed config will be cached but only applied with a call to `load()` or `playing = true`.

## Improvements and fixes

* Added a lot of API level documentation to the modules
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

* Disable buttons, sliders and other components or hide them when the player is not in an "OK"/"enabled" state.
  The player is considered to be in an enabled state e.g. when it is playing and it is not considered
  to be in an enabled state e.g. when it is idle or stopped due to an error.
  Changes to this state can be subscribed to via `Player.onUIEvent('enabled', ...)` and the current
  value can be retrieved using `Player.enabled`.
* Add `useVideoElementForFullscreen` prop to the `FullscreenButton`, which allows configuration of whether
  video element should be displayed in fullscreen mode instead of `fullscreenContainer`.
* Add platform specific `pp-ui-ipad` CSS class to the player controls, overlay and player surface
  on isIpadOS platform.

# 0.5.0

The first public release
