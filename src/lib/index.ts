import type { MP3TagTagsV1Defined } from "mp3tag.js/types/id3v1/tags";
import type { MP3TagTagsV2Defined } from "mp3tag.js/types/id3v2/tags";
import { create } from "xmlbuilder2";
import { db } from "./db";
import { verify } from "argon2";
import { createHash } from "crypto";

export const availableTags: {
  name: string;
  label: string;
  v1name?: keyof MP3TagTagsV1Defined["v1"];
  v2name?: keyof MP3TagTagsV2Defined["v2"];
}[] = [
    {
      name: "title",
      label: "Title",
      v1name: "title",
      v2name: "TIT2"
    },
    {
      name: "artist",
      label: "Artist(s)",
      v1name: "artist",
      v2name: "TPE1"
    },
    {
      name: "album",
      label: "Album",
      v1name: "album",
      v2name: "TALB"
    },
    {
      name: "year",
      label: "Release Year",
      v1name: "year",
      v2name: "TYER"
    },
    {
      name: "comment",
      label: "Comment(s)",
      v1name: "comment",
      v2name: "COMM"
    },
    {
      name: "trackNum",
      label: "Track Number",
      v1name: "track",
      v2name: "TRCK"
    },
    {
      name: "genre",
      label: "Genre",
      v1name: "genre",
      v2name: "TCON"
    },
    {
      name: "isCompilation",
      label: "Is Compilation?",
      v2name: "TCM"
    },
    {
      name: "date",
      label: "Release Date",
      v2name: "TDAT"
    }
  ];

export function formatTime(time: number) {
  if (!time) {
    return false;
  }
  let seconds: number | string = Math.floor(time) % 60;
  let minutes: number | string = Math.floor(time / 100) % 60;
  let hours: number | string = Math.floor(time / 10000) % 24;
  let days: number | string = Math.floor(time / 1000000) % 24;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (hours && minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (days && hours < 10) {
    hours = `0${hours}`;
  }
  return `${days ? `${days}:` : ""}${hours || days ? `${hours}:` : ""}${minutes}:${seconds}`;
}

export function getSubsonicParams(url: URL): {
  username: string | null;
  password: string | null;
  token: string | null;
  salt: string | null;
  version: string | null;
  client: string | null;
  format: string | null;
} {
  const params = url.searchParams;

  return {
    username: params.get("u"),
    password: params.get("p"),
    token: params.get("t"),
    salt: params.get("s"),
    version: params.get("v"),
    client: params.get("c"),
    format: params.get("f")
  };
}

export async function verifySubsonicParams(url: URL): Promise<{
  username: string | null;
  password: string | null;
  token: string | null;
  salt: string | null;
  version: string | null;
  client: string | null;
  format: string | null;
  authenticated: boolean;
  response?: string;
}> {
  // GET SUBSONIC PARAMETERS
  const {
    username,
    password,
    token,
    salt,
    version,
    client,
    format
  } = getSubsonicParams(url);

  let authenticated = false;
  let response

  // CHECK IF PARAMS WERE GIVEN
  if (!(username && (password || (token && salt)) && version && client)) {
    let missingParam = username ? (version ? (client ? false : "c") : "v") : "u";

    response = create({
      "subsonic-response": {
        "@xmlns": "http://subsonic.org/restapi",
        "@status": "failed",
        "@version": "1.16.1",
        "error": {
          "@code": "10",
          "@message": missingParam ? `missing parameter: '${missingParam}'` : "missing authentication"
        }
      }
    }).end();
  }
  else {
    // AUTHENTICATE USER
    const user = await db.user.findUnique({ where: { username }, include: { credentials: true } });

    // CHECK USER EXISTS
    if (user) {
      // IF PASSWORD GIVEN, CHECK IF CORRECT
      if (password) {
        if (await verify(user.credentials!.password, password)) {
          authenticated = true;
        }
      }

      // IF TOKEN GIVEN, CHECK IF CORRECT
      let hashedPassword = createHash("md5").update(user.credentials!.password + salt).digest("hex");
      if (hashedPassword == token) {
        authenticated = true;
      }
    }

    if (!authenticated) {
      response = create({
        "subsonic-response": {
          "@xmlns": "http://subsonic.org/restapi",
          "@status": "failed",
          "@version": "1.16.1",
          "error": {
            "@code": "40",
            "@message": "Wrong username or password"
          }
        }
      }).end();
    }
  }

  return {
    username,
    password,
    token,
    salt,
    version,
    client,
    format,
    authenticated,
    response
  };
}
