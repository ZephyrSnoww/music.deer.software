<script lang="ts">
  import type { ClientData } from "$lib/types";

  const { data }: { data: ClientData } = $props();
</script>

{#if data.songs}
  {#each data.songs as song}
    <div>{song.title}</div>
  {/each}
{/if}
