import { db } from '$lib/db.js';

export async function load({ parent }) {
  const data = await parent();

  let songs = await db.song.findMany({
    include: {
      album: true,
      artists: true,
      favoritedBy: { where: { id: data.account!.id } },
      playData: { where: { userId: data.account!.id } },
      playlists: { where: { OR: [{ ownerId: data.account!.id }, { editors: { some: { id: data.account!.id } } }] } },
      ratings: { where: { userId: data.account!.id } },
      tags: { where: { ownerId: data.account!.id } },
      uploader: true
    },
  });

  return { songs };
}
