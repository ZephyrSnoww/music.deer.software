<script>
  import { appState } from "$lib/state.svelte";
</script>

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
  <a href={`/albums/${appState.selectedSongs[0].album.name}`}> Go to album </a>

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
