<script lang="ts">
  import { appState } from "$lib/state.svelte";
</script>

<div id="song-info">
  <img
    src={`/cover/${appState.nowPlaying?.id}`}
    alt=""
    id="song-cover"
  />
  <div id="song-text">
    {#if appState.nowPlaying}
      <!-- <a id="song-title" href={`/songs/${appState.nowPlaying.id}`}>
        {appState.nowPlaying?.title}
      </a> -->
      <div id="song-title">{appState.nowPlaying?.title}</div>
      <a id="song-album" href={`/albums/${appState.nowPlaying.album.name}`}>
        {appState.nowPlaying.album.name}
      </a>
      <div id="song-artists">
        {#each appState.nowPlaying.artists as artist}
          <a href={`/artists/${artist.name}`} class="song-artist">
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
    object-fit: cover;
  }

  #song-text {
    display: flex;
    flex-direction: column;
    line-height: 1em;
    justify-content: space-between;
    gap: 0.25em;
  }

  #song-album,
  #song-artists,
  #song-title {
    text-wrap: nowrap;
    white-space: nowrap;
    max-width: 25vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #song-album,
  #song-artists {
    font-size: 0.8em;
    line-height: 1em;
    opacity: 0.6;
  }

  #song-artists {
    display: flex;
    gap: 1em;
  }

  #song-artists > a:not(:last-of-type)::after {
    content: ",";
    color: white;
    position: absolute;
  }
</style>
