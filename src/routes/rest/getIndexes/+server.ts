import { verifySubsonicParams } from "$lib/subsonic";
import { db } from "$lib/db.js";
import { create } from "xmlbuilder2";

export async function GET({ setHeaders, url }) {
  const {
    username,
    password,
    token,
    salt,
    version,
    client,
    format,
    authenticated,
    response
  } = await verifySubsonicParams(url);

  // SET HEADERS
  setHeaders({
    "Content-Type": "application/xml"
  });

  if (!authenticated) {
    return new Response(response);
  }

  // ACTUAL RESPONSE HERE
  // GET ARTISTS
  const artists = await db.artist.findMany({ include: { _count: true } });
  let artistData = [];

  console.log(artists);

  for (let artist of artists) {
    artistData.push({
      "@id": artist.name,
      "@name": artist.name,
      "@albumCount": artist._count.albums,
      "@coverArt": "",
      "@artistImageUrl": ""
    });
  }

  // RETURN DATA
  return new Response(create({
    "subsonic-response": {
      "@xmlns": "http://subsonic.org/restapi",
      "@status": "ok",
      "@version": "1.16.1",
      "indexes": {
        "@lastModified": new Date().valueOf().toString(),
        "index": [
          {
            "@name": "#",
            "artist": artistData
          }
        ]
      }
    }
  }).end());
}
