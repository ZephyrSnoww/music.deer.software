<script lang="ts">
  import { appState } from "$lib/state.svelte";
  import PlaybarActions from "./PlaybarActions.svelte";
  import PlaybarControls from "./PlaybarControls.svelte";
  import PlaybarSongInfo from "./PlaybarSongInfo.svelte";

  let audioPlayer: HTMLAudioElement | undefined = $state();

  $effect(() => {
    if (appState.nowPlaying?.id && audioPlayer) {
      audioPlayer.play();
    }
  });
</script>

{#if appState.nowPlaying}
  <audio
    bind:this={audioPlayer}
    src={`/file/${appState.nowPlaying?.filename}`}
    style:display="none"
  ></audio>
{/if}

<div id="playbar">
  <PlaybarSongInfo />

  <PlaybarControls {audioPlayer} />

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
