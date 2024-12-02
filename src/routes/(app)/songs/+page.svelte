<script lang="ts">
  import SongListing from "$lib/comp/SongListing.svelte";
  import { appState } from "$lib/state.svelte";
  import type { ClientData } from "$lib/types";

  const { data }: { data: ClientData } = $props();

  // let appState.selectedSongs: number[] = $state([]);
  let lastClicked: number | undefined = $state();
</script>

<div class="page-title">All Songs</div>

<SongListing />

{#if data.songs}
  <div id="song-listing">
    {#each data.songs as song, index}
      <SongListing
        {song}
        currentlyPlaying={appState.nowPlaying?.id == song.id}
        selected={appState.selectedSongs.map((s) => s.id).includes(song.id)}
        handleClick={(e: MouseEvent) => {
          if (e.shiftKey && lastClicked) {
            let songsToAdd;
            if (index < lastClicked) {
              songsToAdd = data.songs?.slice(index, lastClicked);
            } else {
              songsToAdd = data.songs?.slice(lastClicked + 1, index + 1);
            }

            songsToAdd?.forEach((s) => {
              if (!appState.selectedSongs.map((ss) => ss.id).includes(s.id)) {
                appState.selectedSongs.push(s);
              }
            });
          } else if (e.ctrlKey || e.metaKey) {
            if (appState.selectedSongs.map((s) => s.id).includes(song.id)) {
              appState.selectedSongs = appState.selectedSongs.filter(
                (s) => s.id != song.id,
              );
              lastClicked = undefined;
            } else {
              appState.selectedSongs.push(song);
              lastClicked = index;
            }
          } else {
            appState.selectedSongs = [song];
            lastClicked = index;
          }
        }}
      />
    {/each}
  </div>
{/if}

<style>
  .page-title {
    font-size: 2em;
    font-weight: bold;
    padding: 0.5em 0;
  }

  #song-listing {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
