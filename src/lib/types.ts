import type { Prisma } from "@prisma/client";

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
}
