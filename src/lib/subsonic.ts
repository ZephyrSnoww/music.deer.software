import { create } from "xmlbuilder2";
import { db } from "./db";
import { verify } from "argon2";
import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";

export function getOrCheckParam(url: URL, param: string) {
  const data = url.searchParams.get(param);

  if (!data) {
    return {
      hasParam: false,
      value: create({
        "subsonic-response": {
          "@xmlns": "http://subsonic.org/restapi",
          "@status": "failed",
          "@version": "1.16.1",
          "error": {
            "@code": "10",
            "@message": `missing parameter: '${param}'`
          }
        }
      }).end()
    };
  }

  return {
    hasParam: true,
    value: data
  };
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
  user: Prisma.userGetPayload<{}> | null;
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

  let user = null;
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
    user = await db.user.findUnique({ where: { username }, include: { credentials: true } });

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
    response,
    user
  };
}
