import { db } from '$lib/db.js';

export async function load({ parent }) {
  let artists = await db.artist.findMany({
    include: {
      _count: { select: { albums: true, songs: true } },
      albums: true,
      songs: true
    },
  });

  return { artists };
}
