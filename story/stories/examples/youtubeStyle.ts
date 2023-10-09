export const youtubeStyle = `
.pp-ui {
    --pp-ui-slider-range-progress: rgb(255, 0, 0);
    --pp-ui-slider-range-thumb-bg: rgb(255, 0, 0);
    --pp-ui-slider-range-bg: rgba(255, 255, 255, 0.2);
    /*--pp-ui-slider-range-bg: rgba(255, 255, 255, 0.4);*/
    --pp-ui-slider-height: 3px;
    --pp-ui-slider-border-radius: 0;
    --pp-ui-slider-height-interaction: 5px;
    --pp-ui-slider-size: 10px;
    --pp-ui-slider-thumb-transform: translateX(-50%);

    --pp-ui-label-font-size: 13px;

    --pp-horizontal-bar-bg-color: transparent;

    --pp-ui-thumbnail-height: 120px;

    --pp-ui-bar-gap: 1rem;

    font-family: "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
    color: rgb(221, 221, 221);;

    --pp-ui-icon-fullscreen-enter: url("../../../src/themes/resources/fullscreen-2.svg") no-repeat 50% 50%;
    --pp-ui-icon-fullscreen-exit: url("../../../src/themes/resources/fullscreen-2_exit.svg") no-repeat 50% 50%;
}

.pp-ui-button:hover {
    color: var(--pp-hover-color);
    background-color: transparent;
    border-radius: 0;
}

.pp-ui-button:focus {
    color: var(--pp-hover-color);
    background-color: transparent;
    border-radius: 0;
}

.pp-ui-hover-container-content {
    gap: .5rem;
    padding-bottom: .5rem;
}

.pp-ui-thumbnail-with-thumb {
    border: 2px solid;
    border-radius: 3px;
}


.pp-ui-mute-toggle {
    display: flex;
}

.pp-ui-volumebar {
  height: var(--pp-ui-button-size);
}

.pp-ui-mute-toggle .pp-ui-volumebar {
    width: 0;
    transition: width 250ms;

    padding-left: 0.8rem;

    --pp-ui-slider-thumb-transform: translateX(-50%);
    --pp-ui-slider-height-interaction: var(--pp-ui-slider-height);
    --pp-ui-slider-range-progress: #ffffff;
    --pp-ui-slider-range-thumb-bg: #ffffff;
}

.pp-ui-enabled.pp-ui-mute-toggle:hover .pp-ui-volumebar {
    width: 4.3rem;
}

.pp-ui-mute-toggle .pp-ui-volumebar .pp-ui-slider {
    margin-left: .25rem;
}

.pp-ui-volumebar .pp-ui-slider .pp-ui-slider-range-thumb {
    visibility: hidden;
    opacity: 0;
    transition: opacity 250ms 50ms;
}
.pp-ui-mute-toggle:hover .pp-ui-volumebar .pp-ui-slider .pp-ui-slider-range-thumb {
    visibility: visible;
    opacity: 1;
    background-color: currentColor;
}

.pp-ui-mute-toggle .pp-ui-volumebar .pp-ui-slider:hover .pp-ui-slider-range-thumb {
    visibility: visible;
}

.pp-yt-bottom-bar {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: .5rem;
}

.pp-ui-yt-timebar {
    gap: 0;
}

.pp-ui-yt-timebar .pp-ui-label {
    margin: 0;
}

.pp-yt-center-toggle {
    position: relative;
}

.pp-ui-label-title {
    font-size: 1.2em;
}

.pp-yt-gradient-bottom {
    height: 146px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACSCAYAAACE56BkAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAkgAAAABvhMA+AAAAf0lEQVQoFXWR2w6AMAhD5/T/P9kLx8STVLYHUmgpbBvjd7b5lAij0KxwfYiaEpHikJB2rDpmmHbiWEixRCBXk4hBEvjt31Xt7XbpanZoas11l71LQj+/Ipy9lsg20JJQh4TAQ0CAulSxCJ2p6KiH1U9C1EhmsWcMpyNqpri8pjccGgXJYTY1HgAAAABJRU5ErkJggg==");
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
`
