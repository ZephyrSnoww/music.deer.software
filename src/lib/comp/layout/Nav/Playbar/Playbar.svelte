<script lang="ts">
  import { appState } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import PlaybarActions from "./PlaybarActions.svelte";
  import PlaybarControls from "./PlaybarControls.svelte";
  import PlaybarSongInfo from "./PlaybarSongInfo.svelte";

  let audioPlayer: HTMLAudioElement | undefined = $state();

  let settings = $state({
    shuffle: false,
    loop: false,
    loopOne: false,
  });

  function nextSong() {
    // IF LOOPING ONE SONG, JUST RESTART THE SONG
    if (settings.loopOne) {
      audioPlayer!.play();
      return;
    }

    // IF SHUFFLING QUEUE
    if (settings.shuffle) {
      // ADD INDEX OF FINISHED SONG TO LIST OF PLAYED INDEXES
      appState.playedIndexes.push(appState.nowPlayingIndex);

      // IF WEVE SHUFFLED EVERY SONG
      if (appState.playedIndexes.length >= appState.queue.length) {
        // IF LOOPING, RESTART
        if (settings.loop) {
          appState.playedIndexes = [];
          appState.nowPlayingIndex = Math.floor(
            Math.random() * appState.queue.length,
          );
          appState.nowPlaying = appState.queue[appState.nowPlayingIndex];
          audioPlayer!.play();
          return;
        }

        // OTHERWISE JUST STOP
        return;
      }

      // OTHERWISE, WE HAVENT PLAYED EVERY SONG IN QUEUE
      // FIND NEW RANDOM SONG WE HAVENT PLAYED YET
      let newIndex = Math.floor(Math.random() * appState.queue.length);
      while (appState.playedIndexes.includes(newIndex)) {
        newIndex = Math.floor(Math.random() * appState.queue.length);
      }

      // PLAY THAT SONG
      appState.nowPlayingIndex = newIndex;
      appState.nowPlaying = appState.queue[appState.nowPlayingIndex];
      audioPlayer!.play();
      return;
    }

    if (appState.nowPlayingIndex + 1 < appState.queue.length) {
      appState.nowPlayingIndex += 1;
      appState.nowPlaying = appState.queue[appState.nowPlayingIndex];
      audioPlayer!.play();
      return;
    }

    // OTHERWISE, NOT LOOPING ONE OR SHUFFLING
    if (settings.loop) {
      appState.nowPlayingIndex = 0;
      appState.nowPlaying = appState.queue[appState.nowPlayingIndex];
      audioPlayer!.play();
    }
  }

  onMount(() => {
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);
  });
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
    onended={nextSong}
  ></audio>
{/if}

<div id="playbar">
  <PlaybarSongInfo />

  <PlaybarControls bind:audioPlayer bind:settings />

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
