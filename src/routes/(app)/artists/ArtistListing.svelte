<script lang="ts">
  import type { Prisma } from "@prisma/client";

  let {
    artist,
  }: {
    artist?: Prisma.artistGetPayload<{
      include: {
        _count: { select: { albums: true; songs: true } };
        songs: true;
        albums: true;
      };
    }>;
  } = $props();
</script>

{#if artist}
  <div class="artist-listing">
    <div class="artist-name">{artist.name}</div>
    <div class="artist-year">{artist.albums.sort((alb1, alb2) => alb2.releaseDate.valueOf() - alb1.releaseDate.valueOf())[0].releaseDate.getFullYear()}</div>
    <div class="artist-songs">{artist._count.songs}</div>
    <div class="artist-albums">{artist._count.albums}</div>
  </div>
{:else}
  <div class="artist-listing">
    <div>Name</div>
    <div>Earliest Album</div>
    <div>Songs</div>
    <div>Albums</div>
  </div>
{/if}

<style>
  .artist-listing {
    display: grid;
    grid-template-columns: auto 15em 8em 8em;
    border-top: 1px solid var(--jet);
    padding: 0.75em;
  }
</style>
