<script lang="ts">
  import PlaybarSongInfo from "./PlaybarSongInfo.svelte";
</script>

<div id="playbar">
  <PlaybarSongInfo />

  <div id="playback-controls">Playback Controls</div>

  <div id="action-buttons">Song Actions</div>
</div>

<style>
  #playbar {
    grid-area: playbar;
    display: grid;
    grid-template-columns: auto 25em auto;
    align-items: center;
    background: black;
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
