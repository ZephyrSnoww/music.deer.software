<script lang="ts">
  import type { ClientData } from "$lib/types";

  let { data }: { data: ClientData } = $props();

  let sortedPlaylists = $derived(data.playlists?.sort((a, b) => { return b._count.songs - a._count.songs }));
</script>

{#if sortedPlaylists && sortedPlaylists.length > 0}
  {#each sortedPlaylists as playlist}
    <a href={`/playlists/${playlist.name}`} class="playlist-listing">{playlist.name}</a>
  {/each}
{:else}
  No playlists available!
{/if}

<button>Create Playlist</button>
