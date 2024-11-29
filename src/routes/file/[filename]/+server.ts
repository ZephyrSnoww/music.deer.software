import { env } from '$env/dynamic/private';
import { db } from '$lib/db.js';
import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';

export async function GET({ params, setHeaders }) {
  const filename = params.filename;
  const songData = await db.song.findUnique({ where: { filename } });

  if (!songData) {
    throw error(404);
  }

  try {
    const song = readFileSync(`${env.LIBRARY_FOLDER}/library/${songData.filename}`);

    setHeaders({
      "Content-Type": "audio/mp3",
      "Content-Length": `${song.length}`
    });

    return new Response(song);
  }
  catch (e) {
    throw error(404);
  }
}
