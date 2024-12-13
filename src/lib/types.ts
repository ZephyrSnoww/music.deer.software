import type { Prisma } from "@prisma/client";

export interface CustomFormData {
  message: string;
  error?: boolean;
}

export interface ClientData {
  account?: Prisma.userGetPayload<{
    include: {
      editablePlaylists: true;
      favorites: true;
      ownedPlaylists: true;
      playData: true;
      ratings: true;
      tags: true;
      uploadedSongs: true;
    }
  }> | null;
  songs?: Prisma.songGetPayload<{
    include: {
      album: true;
      artists: true;
      favoritedBy: true;
      playData: true;
      playlists: true;
      ratings: true;
      tags: true;
      uploader: true;
    }
  }>[];
  albums?: Prisma.albumGetPayload<{
    include: {
      _count: { select: { tracks: true } };
      artists: true;
    }
  }>[];
  playlists?: Prisma.playlistGetPayload<{
    include: {
      _count: { select: { songs: true } };
      owner: true;
      editors: true;
      songs: true;
    }
  }>[];
}
