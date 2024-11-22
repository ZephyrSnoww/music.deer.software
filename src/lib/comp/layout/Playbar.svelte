<script lang="ts">
  import PlaybarControls from "./PlaybarControls.svelte";
  import PlaybarSongInfo from "./PlaybarSongInfo.svelte";
</script>

<div id="playbar">
  <PlaybarSongInfo />

  <PlaybarControls />

  <div id="action-buttons">Song Actions</div>
</div>

<style>
  #playbar {
    grid-area: playbar;
    display: grid;
    grid-template-columns: 25em auto 25em;
    align-items: center;
    background: black;
  }

  #action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
