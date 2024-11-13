<div id="playbar">
  <div id="song-info">
    Song Info
  </div>

  <div id="playback-controls">
    Playback Controls
  </div>

  <div id="action-buttons">
    Song Actions
  </div>
</div>

<style>
  #playbar {
    grid-area: playbar;
    display: grid;
    grid-template-columns: auto 25em auto;
    align-items: center;
    background: black;
  }

  #song-info {
    display: flex;
  }

  #playback-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
