import { env } from "$env/dynamic/private";
import { clients } from "$lib/clients.js";
import { db } from "$lib/db.js";
import { fail, redirect } from "@sveltejs/kit";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from "fs";
import MP3Tag from "mp3tag.js";

export async function load({ depends }) {
  depends("data:unsorted");

  try {
    // CREATE FOLDERS IF THEY DONT EXIST
    if (!existsSync(env.LIBRARY_FOLDER)) {
      mkdirSync(env.LIBRARY_FOLDER);
    }
    if (!existsSync(`${env.LIBRARY_FOLDER}/unsorted`)) {
      mkdirSync(`${env.LIBRARY_FOLDER}/unsorted`);
    }

    // READ FILES
    const storedFiles: string[] = readdirSync(`${env.LIBRARY_FOLDER}/unsorted`);

    let fileData = [];

    for (const filename of storedFiles) {
      let tags = new MP3Tag(readFileSync(`${env.LIBRARY_FOLDER}/unsorted/${filename}`)).read();
      fileData.push({
        filename,
        data: tags,
        cover: Buffer.from(tags.v2?.APIC?.[0].data || []).toString("base64")
      });
    }

    return { unsortedFiles: fileData };
  } catch (error) {
    return
  }
}

// ACTION HANDLING
export const actions = {
  // FILE INFO SUBMISSION
  submit: async ({ request, cookies }) => {
    const usernameCookie = cookies.get("username");
    const tokenCookie = cookies.get("token");
    if (!tokenCookie) {
      return redirect(300, "/login");
    }
    const emit = clients.get(tokenCookie);
    if (!emit) {
      return fail(500);
    }

    const user = await db.user.findUnique({ where: { username: usernameCookie } });
    if (!user) {
      return redirect(300, "/login");
    }

    const formData = await request.formData();

    let filename = formData.get("filename") as string;
    let artists = formData.get("artists") as string | null;
    let title = formData.get("title") as string | null;
    let album = formData.get("album") as string | null;
    let year = formData.get("year") as string | null;

    console.log(`Submit ${filename}`);
    console.log(`Artists: ${artists}`);
    console.log(`Title: ${title}`);
    console.log(`Album: ${album}`);
    console.log(`Year: ${year}`);

    // CHECK REQUIRED FIELDS WERE GIVEN
    if (!title || !year || !artists) {
      emit("error", "");
      emit("error", "Songs must have a title, year, and at least one artist");
      return fail(406);
    }

    // SET ALBUM IF NOT GIVEN
    album = album || title;

    // CREATE ARRAY OF ARTISTS
    let artistArray = artists.split(", ");

    // CREATE FOLDERS IF THEY DONT EXIST
    if (!existsSync(env.LIBRARY_FOLDER)) {
      mkdirSync(env.LIBRARY_FOLDER);
    }
    if (!existsSync(`${env.LIBRARY_FOLDER}/library`)) {
      mkdirSync(`${env.LIBRARY_FOLDER}/library`);
    }

    // MOVE SONG FILE
    // CHECK FILENAME IS TAKEN
    let existingFiles = readdirSync(`${env.LIBRARY_FOLDER}/library`);
    let oldFilename = filename;
    filename = `${artists} - ${title}`;
    let originalFilename = filename;
    while (existingFiles.includes(`${filename}.mp3`)) {
      filename = `${originalFilename}-${Math.floor(Math.random() * 10000)}`;
    }
    renameSync(`${env.LIBRARY_FOLDER}/unsorted/${oldFilename}`, `${env.LIBRARY_FOLDER}/library/${filename}.mp3`);

    // ADD TO DB
    let artistCreationData = [];
    for (let artistName of artistArray) {
      artistCreationData.push({
        where: { name: artistName },
        create: {
          name: artistName, albums: {
            connectOrCreate: {
              where: { name: album },
              create: { name: album, releaseDate: new Date(year) }
            }
          }
        }
      });
    }
    let song = await db.song.create({
      data: {
        filename: `${filename}.mp3`,
        releaseDate: new Date(year),
        title,
        uploader: { connect: { id: user.id } },
        album: {
          connectOrCreate: {
            where: {
              name: album
            },
            create: {
              name: album,
              releaseDate: new Date(year)
            }
          }
        },
        artists: {
          connectOrCreate: artistCreationData
        }
      }
    });

    emit("generic", "");
    emit("generic", `Added ${title} to server!`);
    return;
  },

  // FILE DELETION
  delete: async ({ request, cookies }) => {
    const tokenCookie = cookies.get("token");
    if (!tokenCookie) {
      return redirect(300, "/login");
    }
    const emit = clients.get(tokenCookie);
    if (!emit) {
      return fail(500);
    }

    const formData = await request.formData();

    let filename = formData.get("filename") as string | null;

    rmSync(`${env.LIBRARY_FOLDER}/unsorted/${filename}`);
    emit("generic", "");
    emit("generic", `Deleted ${filename}`);
    return;
  }
}
