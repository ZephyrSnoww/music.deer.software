import type { Prisma } from "@prisma/client";

export const appState: {
  subnav: string;
  volume: number;
  selectedSongs: Prisma.songGetPayload<{
    include: {
      album: true,
      artists: true,
      favoritedBy: true,
      playData: true,
      playlists: true,
      ratings: true,
      tags: true,
      uploader: true
    }
  }>[];
  nowPlaying?: Prisma.songGetPayload<{
    include: {
      album: true,
      artists: true,
      favoritedBy: true,
      playData: true,
      playlists: true,
      ratings: true,
      tags: true,
      uploader: true
    }
  }>;
  songToEdit?: Prisma.songGetPayload<{
    include: {
      album: true,
      artists: true,
      favoritedBy: true,
      playData: true,
      playlists: true,
      ratings: true,
      tags: true,
      uploader: true
    }
  }>;
} = $state({
  subnav: "",
  volume: 0.5,
  selectedSongs: [],
  nowPlaying: undefined,
  songToEdit: undefined
});
