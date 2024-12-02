<script lang="ts">
  import type { Prisma } from "@prisma/client";

  let {
    album,
  }: {
    album?: Prisma.albumGetPayload<{
      include: { _count: { select: { tracks: true } }; artists: true };
    }>;
  } = $props();

  console.log(album);
</script>

{#if album}
  <div class="album-listing">
    <div class="album-name">{album.name}</div>
    <div class="album-year">{album.releaseDate.getFullYear()}</div>
    <div class="album-songs">{album._count.tracks}</div>
    <div class="album-artists">
      {#each album.artists as artist}
        <a href={`/artists/${artist.name}`} class="artist">{artist.name}</a>
      {/each}
    </div>
  </div>
{:else}
  <div class="album-listing">
    <div>Name</div>
    <div>Year</div>
    <div>Songs</div>
    <div>Artists</div>
  </div>
{/if}

<style>
  .album-listing {
    display: grid;
    grid-template-columns: auto 8em 8em 25em;
    border-top: 1px solid var(--jet);
    padding: 0.75em;
  }

  .album-artists {
    display: flex;
    gap: 1em;
  }

  .album-artists > a:not(:last-of-type)::after {
    content: ",";
    color: white;
    position: absolute;
  }
</style>
