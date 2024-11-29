import { verifySubsonicParams } from "$lib";
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
  return new Response(create({
    "subsonic-response": {
      "@xmlns": "http://subsonic.org/restapi",
      "@status": "ok",
      "@version": "1.16.1",
      "musicFolders": {
        "musicFolder": [
          {
            "@id": "0",
            "@name": "Music Library"
          }
        ]
      }
    }
  }).end());
}
