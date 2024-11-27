import type { Prisma } from "@prisma/client";

export interface CustomFormData {
  message: string;
  error?: boolean;
}

export interface ClientData {
  account?: Prisma.userGetPayload<{include: {
    editablePlaylists: true,
    favorites: true,
    ownedPlaylists: true,
    playData: true,
    ratings: true,
    tags: true,
    uploadedSongs: true
  }}> | null;
  songs?: Prisma.songGetPayload<{include: {
    album: true,
    artists: true,
    favoritedBy: true,
    playData: true,
    playlists: true,
    ratings: true,
    tags: true,
    uploader: true
  }}>[]
}
