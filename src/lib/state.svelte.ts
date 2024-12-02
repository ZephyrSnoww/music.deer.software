import type { Prisma } from "@prisma/client";

export const appState: {
  subnav: string;
  selectedSongs: number[];
  nowPlaying?: Prisma.songGetPayload<{include: {
    album: true,
    artists: true,
    favoritedBy: true,
    playData: true,
    playlists: true,
    ratings: true,
    tags: true,
    uploader: true
  }}> & { cover?: string; };
} = $state({
  subnav: "",
  selectedSongs: [],
  nowPlaying: undefined
});
