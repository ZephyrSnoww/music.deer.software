<script lang="ts">
  import SongListing from "$lib/comp/SongListing.svelte";
  import { appState } from "$lib/state.svelte";
  import type { ClientData } from "$lib/types";

  const { data }: { data: ClientData } = $props();

  let selectedSongs: number[] = $state([]);
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
        selected={selectedSongs.includes(song.id)}
        handleClick={(e: MouseEvent) => {
          if (e.ctrlKey || e.metaKey) {
            if (selectedSongs.includes(song.id)) {
              selectedSongs = selectedSongs.filter((id) => id != song.id);
              lastClicked = undefined;
            } else {
              selectedSongs.push(song.id);
              lastClicked = index;
            }
          } else if (e.shiftKey && lastClicked) {
            let songsToAdd;
            if (index < lastClicked) {
              songsToAdd = data.songs?.slice(index, lastClicked);
            } else {
              songsToAdd = data.songs?.slice(lastClicked + 1, index + 1);
            }

            songsToAdd?.forEach((s) => {
              if (!selectedSongs.includes(s.id)) {
                selectedSongs.push(s.id);
              }
            });
          } else {
            selectedSongs = [song.id];
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
