# OLD README

*TODO incorporate this into README.MD, but check first that everything works.*

### Startup Options and Poster Image

In the example above, the player surface component is responsible for loading the configuration. If you 
want a poster image and not load the content automatically but let the user explicitly start the load, you 
can defer the configuration to a start button instead and also pass a poster image:

```javascript
return (
    <PlayerSurface player={player} // note that we are not passing the config here anymore
                   ref={playerSurfaceRef}>
        <BaseThemeOverlay
          player={player}
          startConfig={config} // instead we let the start button be visible 
          posterUrl={poster}   // and show a poster image
          fullscreenRef={playerSurfaceRef}
        />
    </PlayerSurface>
)

```

### Track selection menu 

By default, the base theme overlay provides a slide in menu to select audio, text and video tracks. You 
can configure the menu items, their order and their representation using the `menuSelectionOptions` property
of the default overlay:

```javascript
return (
    <PlayerSurface player={player} config={config}>
        <BaseThemeOverlay
          player={player}
          menuSelectionOptions={[
            {type: "audio", label: "Language", hideCurrentlyActive:true, hideWhenUnavailable: true},
            {type: "text", label: "Subtitles", hideCurrentlyActive:true, hideWhenUnavailable: true},
            {type: "video", label: "Video", hideCurrentlyActive:true, hideWhenUnavailable: true}
          ]}
        />
    </PlayerSurface>
)
```
The above example shows the defaults. You can change the order, remove some selections, change the label
that will be used to show the selection groups, and configure the behavior if elements of the group are
not available.

The labels that are displayed in by default in the menu are currently only configurable globally using the 
labeler options in the `player` instance. Here are the defaults and how you can change them:

```javascript
player.trackLabelerOptions = {
    usePlayingRenditionInAbrLabel: true,
    useNativeLanguageNames: false,
    abrLabel: "Auto",
    disabledTrackLabel: "Off",
    unknownTrackLabel: "Unknown"
}
```

In addition to the default labeler, you can also provide a custom function to create labels for tracks:

```javascript
// set a custom track labeler
player.trackLabeler = (track, player) => { return '...'}
```

The function receives the track and the player instance and must return a string that will be used as the 
track label. You can find the implementation for inspiration [here](./src/Player.ts#29)

### Seek buttons

By default, the basic theme renders a seek forward and a seek backward button that seek 10 seconds forward 
and backward respectively. You can use the `seekForward` and `seekBackward` properties to control the seek 
duration. A value of 0 will remove the button from the layout. 

## Custom controls and Player Interfaces

It can (and probably will) happen that the basic overlays are not enough, and you need to build some 
custom controls on top of the player surface or somewhere else. This library provides building blocks to
create customer player interfaces. Note that when you try this, you will notice that the basic look and 
feel of the controller components is still the same. This can be changed through CSS and you will need to 
overwrite some CSS variables, for instance, or change icons, colors or sizes, or provide complete custom
styles for your layouts. Take a look at the [base theme](./src/themes/pp-ui-base-theme.css). Here we are 
going to focus on combining the available components and constructing a different player interface structure.

Here is an example:

```javascript
<PlayerSurface player={customPlayer1} config={CONFIG_1.config} style={{height: "320px"}}>
  <PlayerControls player={customPlayer1}>
    {/* We are creating a vertical bar to build our controls top to bottom */}
    <VerticalBar className={"pp-ui-transparent"}>
      {/* The first horizontal row shows some custom title for the content */}
      <HorizontalBar>
        <div>
          <div>
            <Label label={"It is pretty here"} className={"pp-ui-label-title"}/>
          </div>
          <div>
            <Label label={"really very pretty"} className={"pp-ui-label-subtitle"}/>
          </div>
        </div>
      </HorizontalBar>
  
      {/* We add a spacer to push the rest of the content to the bottom */}
      <Spacer/>
  
      {/* We create a horizontal bar for the thumbnails */}
      <HorizontalBar className={"pp-ui-transparent"}>
        <Thumbnail player={customPlayer1} listenToHover={true} moveRelativeToParent={true}/>
      </HorizontalBar>
   
      {/* The primary controls at the bottomg*/}
      <HorizontalBar>
        <PlayPauseButton player={customPlayer1} resetRate={true}/>
        <CurrentTime player={customPlayer1}/>
        <SeekBar player={customPlayer1} adjustWhileDragging={true} enableThumbnailSlider={false}/>
        <TimeLeft player={customPlayer1}/>
        <FullscreenButton fullscreenContainer={customSurface1} player={customPlayer1}/>
      </HorizontalBar>
    </VerticalBar>
  </PlayerControls>
</PlayerSurface>
```

The basic building blocks that we are using here are 

 * `PlayerControls` which is responsible for auto-hiding the player UI after some time
 * `VerticalBar` which uses a flex layout, so we can build the UI top to bottom
 * `HorizontalBar` which uses a flex layout, so we can build component rows left to right
 * `Spacer` to push some content down and fill empty space
 * `Thumbnail` to render scrubbing thumbnails
 * `PlayPauseButton` so play or pause the content
 * `CurrentTime` displays the current playback position
 * `SeekBar` to show progress and allow to seek inside the content
 * `TimeLeft` shows the remaining playback duration
 * `FullscreenButton` to push the related surface into fullscreen mode

This should hopefully look intuitive. One thing to point out here is that we set
`enableThumbnailSlider` to `false` on the `SeekBar`. The `SeekBar` does have embedded support for 
scrubbing thumbnails, however, the thumbnail location would be limited to the width of the slider. Since 
we want the thumbnails to show over the full width of the video surface, we are creating a dedicated 
horizontal bar with a `Thumbnail` component inside and configure the component to adjust its rendering 
position relative to its parent (`moveRelativeToParent`). Using `listenToHover` the thumbnail component 
still tracks the hover position exposed by the seek bar, but it adjusts its location now to the full width 
of the parent surface.

### Player and Player UI Events

When building custom interfaces and components, there might be two type of events that one would want to 
listen to. Events triggered by the video player, i.e. prestoplay events, and events that are triggered by 
the UI components and the UI "Player". We provide two helper function to hook into these events.

To hook into player related events, you can use `usePrestoCoreEvent`:

```javascript
usePrestoCoreEvent(clpp.events.STATE_CHANGED, props.player, (e, presto) => {
  console.log("Current player state: " + e.detail.currentState)
});
```

`usePrestoCoreEvent` takes the event name, the `Player` instance and a function that will receive the event 
and the prestoplay instance that triggered the event.

In addition, this library provides some dedicated UI related events that a component can hook into using 
`usePrestoUiEvent`:

```javascript
usePrestoUiEvent("slideInMenuVisible", props.player, (visible) => {
  // ...
})
```

Conceptually this is the same, with the difference being that the payload is directly exposes, i.e. you do 
not receive an Event object with details, and that the events that are expose here are related to the user 
interface and its operation.

The following UI events are exposed with these payloads:

```typescript
export interface UIEvents {
  /**
   * Triggered when the slide in menu state changes
   */
  slideInMenuVisible: boolean,
  /**
   * Triggered when the `PlayerControls` visibility changes
   */
  controlsVisible: boolean,
  /**
   * Triggered when a track selection changes
   */
  trackSelected: Track,
  /**
   * Triggered when the selected video track changes
   */
  videoTrackChanged: Track,
  /**
   * Triggered when the selected audio track changes
   */
  audioTrackChanged: Track,
  /**
   * Triggered when the selected text track changes
   */
  textTrackChanged: Track,
  /**
   * Triggered when the available text track change
   */
  textTracksAvailable: Track[],
  /**
   * Triggered when the available audio track change
   */
  audioTracksAvailable: Track[],
  /**
   * Triggered when the available video track change
   */
  videoTracksAvailable: Track[],
  /**
   * Triggered when the currently playing video rendition changes, i.e.
   * a quality change
   */
  playingVideoTrackChanged: Track | undefined,
  /**
   * Triggered on a user interaction (i.e. mouse hover) on top of the
   * player surface
   */
  surfaceInteraction: undefined,
  /**
   * Triggered when the hover position changes
   */
  hoverPosition: { position: number, percent: number }
}
```

## Themes

The library currently contains one theme that is delivered in two variants. The "embedded" theme contains
all the icons that are used by the theme inline, while the "non-embedded" version does reference the icons
relative.

You can find the themes and resources in `@castlabs/prestoplay-react-components/dist/themes` in the 
installed bundle. The sources can be found [here](./src/themes).
