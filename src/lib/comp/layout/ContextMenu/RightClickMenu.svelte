<script lang="ts">
  import { appState } from "$lib/state.svelte";
  import SongMenu from "./SongMenu.svelte";

  let open = $state(false);
  let pos = $state({ x: 0, y: 0 });
  let type = $state("");
</script>

<svelte:window
  oncontextmenu={(e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) return;

    const hasDataType =
      (e.target as HTMLElement).closest(`[data-type="artist"]`) ||
      (e.target as HTMLElement).closest(`[data-type="album"]`) ||
      (e.target as HTMLElement).closest(`[data-type="playlist"]`) ||
      (e.target as HTMLElement).closest(`[data-type="song"]`);

    if (hasDataType) {
      e.preventDefault();
      if (appState.selectedSongs.length <= 1) (e.target as HTMLElement).click();
      pos = { x: e.clientX, y: e.clientY };
      open = true;

      type = (e.target as HTMLElement).closest(`[data-type="artist"]`)
        ? "artist"
        : (e.target as HTMLElement).closest(`[data-type="album"]`)
          ? "album"
          : (e.target as HTMLElement).closest(`[data-type="playlist"]`)
            ? "playlist"
            : (e.target as HTMLElement).closest(`[data-type="song"]`)
              ? "song"
              : "";
    }
  }}
  onclick={(e: MouseEvent) => {
    if (
      open &&
      !(e.target as HTMLElement).closest(`[data-type="context-menu"]`)
    ) {
      open = false;
      e.preventDefault();
      e.stopPropagation();
    }
  }}
/>

{#if open}
  <div
    id="right-click-menu"
    data-type="context-menu"
    style:transform={`translate(${pos.x}px, ${pos.y}px)`}
  >
    {#if type == "song"}
      <SongMenu />
    {/if}
  </div>
{/if}

<style>
  #right-click-menu {
    background: var(--fog);
    border-radius: 0.5em;
    /* padding: 0.5em; */
    position: absolute;
    z-index: 75;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  :global(#right-click-menu > *) {
    padding: 0.5em;
  }
</style>
