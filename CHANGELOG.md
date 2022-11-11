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
* Added testing infrastructure
* Added wrapper properties and functions for 
  * `position` (read/write) Use this property to seek
  * `volume` (read/write)
  * `muted` (read/write)
  * `live` (read only)
  * `seekRange` (read only)
  * `state` (read only)
  * `rate` (read/write)
  * `playing` (read/write)
* Added seek chaining to make sure that we are not issuing seeks that will not be the
  final target position. This will make consecutive seeks faster
* Improved support for Touch devices and touch vs mouse interaction
* Fixed fullscreen button behaviour on iOS devices
* Fixed issue with the default labeler with some HLS content tracks. Now video tracks
  that do not expose a size are excluded.

## New Features

* Added `enabled` state to the player and tracking utilities for components. Where it makes sense, the 
  components now track the enabled state of the player using `usePrestoEnabledState` and implement a 
  "disabled" state if no content is loaded.
* Added a prop to the `FullscreenButton` to decide to use the video element or the passed container based
  on the target platform.
* Added platform specific `pp-ui-ipad` css class to the player controls, overlay and the surface

# 0.5.0

The first public release
