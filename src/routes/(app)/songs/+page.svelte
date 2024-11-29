<script lang="ts">
  import SongListing from "$lib/comp/SongListing.svelte";
  import { appState } from "$lib/state.svelte";
  import type { ClientData } from "$lib/types";

  const { data }: { data: ClientData } = $props();
</script>

<div class="page-title">All Songs</div>

<SongListing />

{#if data.songs}
  <div id="song-listing">
    {#each data.songs as song}
      <SongListing
        {song}
        currentlyPlaying={appState.nowPlaying?.id == song.id}
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
