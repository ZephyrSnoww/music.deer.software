import { env } from '$env/dynamic/private';
import { db } from '$lib/db.js';
import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import MP3Tag from 'mp3tag.js';

export async function GET({ params, setHeaders }) {
  const songId = Number(params.songId);

  if (isNaN(songId)) {
    throw error(404);
  }

  const songData = await db.song.findUnique({ where: { id: songId } });

  if (!songData) {
    throw error(404);
  }

  // try {
    const songTags = new MP3Tag(readFileSync(`${env.LIBRARY_FOLDER}/library/${songData.filename}`)).read();
    const songCover = Buffer.from(songTags.v2?.APIC?.[0].data || []);

    setHeaders({
      "Content-Type": "image/png",
      "Content-Length": `${songCover.length}`
    });

    return new Response(songCover);
  // }
  // catch (e) {
  //   throw error(404);
  // }
}
