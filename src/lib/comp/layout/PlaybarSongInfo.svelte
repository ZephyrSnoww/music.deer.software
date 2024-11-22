<script lang="ts">
  import { appState } from "$lib/state.svelte";
</script>

<div id="song-info">
  <img
    src={appState.nowPlaying?.coverFilename || "/placeholder-cover.png"}
    alt=""
    id="song-cover"
  />
  <div id="song-text">
    {#if appState.nowPlaying}
      <a id="song-title" href={`/songs/${appState.nowPlaying?.id}`}>
        {appState.nowPlaying?.title}
      </a>
      <a id="song-album" href={`/albums/${appState.nowPlaying?.albumId}`}>
        {appState.nowPlaying.album.name}
      </a>
      <div id="song-artists">
        {#each appState.nowPlaying.artists as artist}
          <a href={`/artists/${artist.id}`} class="song-artist">
            {artist.name}
          </a>
        {/each}
      </div>
    {:else}
      <div id="song-title">-</div>
      <div id="song-album">-</div>
      <div id="song-artists">
        <div class="song-artist">-</div>
      </div>
    {/if}
  </div>
</div>

<style>
  #song-info {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0.5em;
    gap: 0.5em;
    flex: 0 0 25vw;
  }

  #song-cover {
    height: 3.5em;
    aspect-ratio: 1;
  }

  #song-text {
    display: flex;
    flex-direction: column;
    line-height: 1em;
    justify-content: space-between;
  }

  #song-album,
  #song-artists {
    font-size: 0.8em;
    line-height: 1em;
    opacity: 0.6;
  }
</style>
