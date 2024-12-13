<script lang="ts">
  import type { ClientData } from "$lib/types";
  import ArtistListing from "./ArtistListing.svelte";

  let { data }: { data: ClientData } = $props();
</script>

<div class="page-title">All Artists</div>

{#if data.artists}
  <div id="album-listing">
    <ArtistListing />
    {#each data.artists as artist, index}
      <ArtistListing {artist} />
    {/each}
  </div>
{/if}

<style>
  .page-title {
    font-size: 2em;
    font-weight: bold;
    padding: 0.5em 0;
  }

  #album-listing {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
