<script lang="ts">
  import PlaybarActions from "./PlaybarActions.svelte";
  import PlaybarControls from "./PlaybarControls.svelte";
  import PlaybarSongInfo from "./PlaybarSongInfo.svelte";
</script>

<div id="playbar">
  <PlaybarSongInfo />

  <PlaybarControls />

  <PlaybarActions />
</div>

<style>
  #playbar {
    grid-area: playbar;
    display: grid;
    grid-template-columns: 25em auto 25em;
    align-items: center;
    background: black;
  }
</style>
