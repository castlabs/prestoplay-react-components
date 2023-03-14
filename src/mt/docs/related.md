# Related Issues

1. new clpp.Player() should check that video element/id in fact exists
2. playerRef.current.setMuted(true) and setVolume only work after playback started. This is not documented.
3. Presto converts my <video> element into <div> and creates its own video element ... breaks my styles. And I think maybe this is not documented!
   ```html
   <div class="clpp-container App-video" style="">
     <video class="clpp-fill clpp-video-0" controls="" crossorigin="anonymous" src="blob:http://localhost:3000/460548f1-110f-4eca-8a1d-677b6da861d2"></video>
   </div>
   ```
4. `import "@castlabs/prestoplay/clpp.styles.css"` What does this do anyway? I seems to stretch my video element over the whole page. I do not like that.
5. Trying to play HLS, getting error. This is not easy to read. I do not know what to do to fix it.
  ```
  cl.core.js:212 10:35:29.346 [clpp.players] No compatible Player Factory found for sources: [{…}]0: {url: 

  Error: FATAL Clpp-Error [Category 7 - Code 7003]
  ```
6. In documentation on HLS some info is missing
```
// Uncomment next line to add HLS playback capability (e.g. on Chrome)
// player.use(clpp.hls.HlsComponent);

// ME: but don't I have to import it first?
Like import "@castlabs/prestoplay/cl.hls"
```
7. When I `player.use` a random bullshit, the error message I get is not very helpful.
8. In Chrome I'm getting "Content unsupported by browser". In Safari it plays. In Chrome on JWPlayer however it plays, so in the least the error message is wrong. See this repo for reproduction
9. Where is doc on 
```js
player.on('volumechange', event => {
  // ...
});
```
10. In the manual there is 2x HLS component, that leads you to forget about mux.js, bc. that is in the second, not first!
