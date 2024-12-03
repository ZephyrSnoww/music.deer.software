<script lang="ts">
  import { appState } from "$lib/state.svelte";

  let open = $state(false);
  let pos = $state({ x: 0, y: 0 });
</script>

<svelte:window
  oncontextmenu={(e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) return;

    else if ((e.target as HTMLElement).closest(`[data-type="song"]`)) {
      e.preventDefault();
      if (appState.selectedSongs.length <= 1) (e.target as HTMLElement).click();
      pos = { x: e.clientX, y: e.clientY };
      open = true;
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
    <!-- PLAYLISTS BUTTON -->
    <button class="nostyle">
      Add {appState.selectedSongs.length > 1
        ? `${appState.selectedSongs.length} songs`
        : "song"} to playlists...
    </button>

    <!-- LIKED SONGS BUTTON -->
    <button class="nostyle">
      Favorite {appState.selectedSongs.length > 1
        ? `${appState.selectedSongs.length} songs`
        : "song"}
    </button>

    <!-- QUEUE BUTTON -->
    <button class="nostyle">
      Add {appState.selectedSongs.length > 1
        ? `${appState.selectedSongs.length} songs`
        : "song"} to queue
    </button>

    {#if appState.selectedSongs.length == 1}
      <!-- ARTIST BUTTON -->
      <a href={`/artists/${appState.selectedSongs[0].artists[0].name}`}>
        Go to artist
      </a>
      
      <!-- ALBUM BUTTON -->
      <a href={`/albums/${appState.selectedSongs[0].album.name}`}>
        Go to album
      </a>
      
      <!-- EDIT BUTTON -->
      <button
        class="nostyle"
        onclick={(e) => {
          appState.songToEdit = appState.selectedSongs[0];
        }}
      >
        Edit "{appState.selectedSongs[0].title}"
      </button>
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

  #right-click-menu > * {
    padding: 0.5em;
  }
</style>
