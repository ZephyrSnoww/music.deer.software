<script lang="ts">
  import { appState } from "$lib/state.svelte";
  import type { Prisma } from "@prisma/client";

  const {
    song,
    currentlyPlaying = false,
  }: {
    song?: Prisma.songGetPayload<{
      include: {
        album: true;
        artists: true;
        favoritedBy: true;
        playData: true;
        playlists: true;
        ratings: true;
        tags: true;
        uploader: true;
      };
    }>;
    currentlyPlaying?: boolean;
  } = $props();
</script>

{#if song}
  <button
    class="song-listing nostyle"
    class:playing={currentlyPlaying}
    onclick={(e: MouseEvent) => {
      // @ts-expect-error Don't know why it complains about this
      if (e.target?.localName != "a") {
        e.preventDefault();
        appState.nowPlaying = song;
      }
    }}
  >
    <!-- SELECTED -->
    <div class="selected">x</div>

    <!-- TITLE -->
    <div class="title">{song.title}</div>

    <!-- ALBUM -->
    <div class="album">
      <a href={`/album/${song.album.name}`}>{song.album.name}</a>
    </div>

    <!-- ARTISTS -->
    <div class="artists">
      {#each song.artists as artist}
        <a href={`/artists/${artist.name}`} class="artist">{artist.name}</a>
      {/each}
    </div>

    <!-- PLAYS -->
    <div class="plays">
      {song.playData[0]?.playCount || 0}
    </div>

    <!-- DURATION -->
    <div class="duration">0:00</div>

    <!-- RATING -->
    <div class="rating">
      {#each { length: 5 } as _, i}
        <div
          class="star icon"
          style:color={(song.ratings[0]?.rating || 0) > i
            ? "var(--lime)"
            : currentlyPlaying
              ? "var(--black)"
              : "var(--jet)"}
        >
          star
        </div>
      {/each}
    </div>

    <!-- LIKED -->
    <div class="liked">
      <span class="icon">favorite</span>
    </div>
  </button>
{:else}
  <div class="song-listing">
    <div class="selected">x</div>
    <div class="title">Title</div>
    <div class="album">Album</div>
    <div class="artists">Artists</div>
    <div class="plays">Plays</div>
    <div class="duration">Time</div>
    <div class="rating">Rating</div>
    <div class="liked">&lt;3</div>
  </div>
{/if}

<style>
  .song-listing {
    width: 100%;
    display: grid;
    align-items: stretch;
    grid-template-columns: 3em auto 15em 25em 3.5em 4em 6em 3em;
    grid-template-areas: "selected title album artists plays duration rating liked";
    border-top: 1px solid var(--jet);
  }

  .playing {
    background: var(--jet);
  }

  .song-listing > div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-wrap: nowrap;
    overflow: hidden;
    white-space: nowrap;
    /* border: 1px solid var(--lime); */
    padding: 0.75em;
  }

  .title,
  .album,
  .artists {
    justify-content: flex-start !important;
  }

  .album a {
    text-wrap: nowrap;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .artists {
    gap: 0 1em;
    flex-wrap: wrap;
  }

  .artists > a:not(:last-of-type)::after {
    content: ",";
    color: white;
    position: absolute;
  }

  .artist {
    text-wrap: nowrap;
  }
</style>
