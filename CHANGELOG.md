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
  better timing (the order of execution is clear and we wait for the initializer to
  complete before we use the player core) and simplifies the player wrapper.

## Improvements and fixes

* Added a lot of API level documentation to the modules
* Added testing infrastructure
* Added wrapper properties and functions for 
  * `position` (read only, use `seek()` to change the position)
  * `seek()`
  * `volume` (read/write)
  * `muted` (read/write)
  * `live` (read only)
  * `seekRange` (read only)
  * `state` (read only)
  * `rate` (read/write)
  * `playing` (read/write)

# 0.5.0

The first public release
