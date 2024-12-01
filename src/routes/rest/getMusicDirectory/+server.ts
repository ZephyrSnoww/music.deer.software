import { db } from "$lib/db.js";
import { getOrCheckParam, verifySubsonicParams } from "$lib/subsonic";
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
    response,
    user
  } = await verifySubsonicParams(url);

  // SET HEADERS
  setHeaders({
    "Content-Type": "application/xml"
  });

  if (!authenticated) {
    return new Response(response);
  }

  // CHECK IF ID PARAM WAS GIVEN
  const { hasParam: hasID, value: id } = getOrCheckParam(url, "id");
  if (!hasID) {
    return new Response(id);
  }

  // ACTUAL RESPONSE HERE
  const artist = await db.artist.findUnique({
    where: { name: id },
    include: {
      albums: {
        include: {
          artists: true,
          tracks: {
            include: {
              playData: {
                where: {
                  userId: user!.id
                }
              }
            }
          }
        }
      },
      songs: {
        include: {
          playData: {
            where: {
              userId: user!.id
            }
          }
        }
      }
    }
  });

  if (artist) {
    return new Response(create({
      "subsonic-response": {
        "@xmlns": "http://subsonic.org/restapi",
        "@status": "ok",
        "@version": "1.16.1",
        "directory": {
          "@id": artist.name,
          "@name": artist.name,
          "@playCount": artist.songs.reduce((partialSum, song) => partialSum + song.playData[0]?.playCount || 0, 0),
          // "@played": "",
          "@albumCount": artist.albums.length,
          "child": artist.albums.map((album) => {
            return {
              "@id": album.name,
              "@parent": artist.name,
              "@isDir": "true",
              "@title": album.name,
              "@name": album.name,
              "@album": album.name,
              "@artist": artist.name,
              "@year": album.releaseDate.getFullYear(),
              // "@genre": "",
              // "@coverArt": "",
              // "@duration": "",
              "@playCount": album.tracks.reduce((partialSum, song) => partialSum + song.playData[0]?.playCount || 0, 0),
              // "@created": "",
              "@artistId": artist.name,
              "@songCount": album.tracks.length,
              "@isVideo": "false",
              // "@played": "",
              "@bpm": "0",
              "@comment": "",
              "@sortName": "",
              "@mediaType": "album",
              "@musicBrainzId": "",
              "@channelCount": "0",
              "@samplingRate": "0"
            }
          })
        }
      }
    }).end());
  }
  else {
    // TODO
  }

}
