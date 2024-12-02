<script lang="ts">
  import type { ClientData } from "$lib/types";
  import AlbumListing from "./AlbumListing.svelte";

  let { data }: { data: ClientData } = $props();
</script>

<div class="page-title">All Albums</div>

{#if data.albums}
  <div id="album-listing">
    <AlbumListing />
    {#each data.albums as album, index}
      <AlbumListing {album} />
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
