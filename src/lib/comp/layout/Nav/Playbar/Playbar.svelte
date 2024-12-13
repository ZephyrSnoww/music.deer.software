<script lang="ts">
  import { appState } from "$lib/state.svelte";
  import PlaybarActions from "./PlaybarActions.svelte";
  import PlaybarControls from "./PlaybarControls.svelte";
  import PlaybarSongInfo from "./PlaybarSongInfo.svelte";

  let audioPlayer: HTMLAudioElement | undefined = $state();
</script>

{#if appState.nowPlaying}
  <audio
    bind:this={audioPlayer}
    bind:volume={appState.volume}
    src={`/file/${appState.nowPlaying?.filename}`}
    style:display="none"
    oncanplay={(e) => {
      audioPlayer!.play();
    }}
  ></audio>
{/if}

<div id="playbar">
  <PlaybarSongInfo />

  <PlaybarControls bind:audioPlayer />

  <PlaybarActions bind:audioPlayer />
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
