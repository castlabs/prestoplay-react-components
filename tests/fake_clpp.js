export const clpp = {
  Player: {
    State: {
      IDLE: 0,
      PREPARING: 1,
      BUFFERING: 2,
      PLAYING: 3,
      PAUSED: 4,
      ENDED: 5,
      ERROR: 6,
      UNSET: 7,
    },
  },
  events: {
    BufferingReasons: {
      SEEKING: 1, NO_DATA: 2,
    },
  },
}
