import { env } from "$env/dynamic/private";
import { clients } from "$lib/clients.js";
import { db } from "$lib/db.js";
import { fail, redirect } from "@sveltejs/kit";
import { exec } from "child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import MP3Tag from "mp3tag.js";

export const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();

    const usernameCookie = cookies.get("username");
    const tokenCookie = cookies.get("token");
    if (!tokenCookie || !usernameCookie) {
      return redirect(302, "/login");
    }
    const emit = clients.get(tokenCookie);
    if (!emit) {
      return fail(500);
    }

    const user = await db.user.findUnique({ where: { username: usernameCookie } });
    if (!user) {
      return redirect(302, "/login");
    }

    let file = formData.get("file");
    let url = formData.get("url") as string | null;
    let createPlaylist = formData.get("createPlaylist") as string | null;
    let playlistName = formData.get("playlistName") as string | null;

    // ERROR IF NEITHER A FILE NOR URL WERE GIVEN
    if (!url && (!(file instanceof Object) || !file.name || file.name.includes("/") || file.size == 0)) {
      emit("error", "");
      emit("error", "Invalid file or URL");
      return fail(422, { error: true, message: "You must provide a valid file or URL" });
    }

    // ERROR IF PLAYLIST SHOULD BE CREATED BUT NO NAME WAS GIVEN
    if (createPlaylist && !playlistName) {
      emit("error", "");
      emit("error", "You must enter a playlist name");
      return fail(422, { error: true, message: "You must enter a playlist name" });
    }

    // ERROR IF PLAYLIST NAME IS TAKEN
    const existingPlaylist = await db.playlist.findUnique({ where: { name: playlistName! } });
    if (existingPlaylist?.ownerId != user.id) {
      emit("error", "");
      emit("error", "That playlist name is taken");
      return fail(422, { error: true, message: "That playlist name is taken" });
    }

    // CHECK SAVE PATH EXISTS
    if (!existsSync(env.LIBRARY_FOLDER)) {
      mkdirSync(env.LIBRARY_FOLDER);
    }
    if (!existsSync(`${env.LIBRARY_FOLDER}/unsorted`)) {
      mkdirSync(`${env.LIBRARY_FOLDER}/unsorted`);
    }

    // IF A FILE WAS UPLOADED
    if ((file instanceof Object) && file.name && !file.name.includes("/") && file.size > 0) {
      // CHECK IF FILENAME IS TAKEN
      let filename = file.name.split(".")[0];
      let fileType = file.type.split("/")[1];
      let fullFilename = `${filename}.${fileType}`;

      const storedFiles: string[] = readdirSync(`${env.LIBRARY_FOLDER}/unsorted`);
      while (storedFiles.includes(fullFilename)) {
        fullFilename = `${filename}-${Math.floor(Math.random() * 10000)}.${fileType}`;
      }

      // SAVE FILE
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      writeFileSync(`${env.LIBRARY_FOLDER}/unsorted/${fullFilename}`, fileBuffer, "base64");
      emit("generic", "");
      emit("generic", "File uploaded successfully!");
      return { message: "Uploaded file successfully", filename: fullFilename };
    }

    // IF NO FILE WAS UPLOADED AND A URL WAS GIVEN
    if (url) {
      // USE YT-DLP TO SAVE FILES TO UNSORTED FOLDER
      const ytdl = exec(`yt-dlp -o "${env.LIBRARY_FOLDER}/unsorted/%(creator,uploader,channel)s - %(title,fulltitle)s.%(ext)s" -x --audio-format mp3 --embed-metadata --embed-thumbnail ${url}`);
      let error = false;
      let filename = "";
      let files: string[] = [];

      // YT-DLP START EVENT
      ytdl.once("spawn", (m: any) => {
        console.log("spawned");
      });

      // EMIT YT-DLP EVENTS FROM STDOUT
      ytdl.stdout?.on("data", (z: string) => {
        console.log(`\nstdout:\n${z}`);
        if (z.match(/Extracting URL/)) {
          emit("upload", "");
          emit("upload", "Fetching data");
        }
        else if (z.match(/\[download\] Destination: \.\/music\/unsorted\/(.+)/)) {
          filename = z.match(/\[download\] Destination: \.\/music\/unsorted\/(.+)/)?.[1] || "";
        }
        else if (z.match(/\[download\](.+)% of /)) {
          emit("upload", `Downloading${filename ? ` ${filename}` : ""}<br />${z.match(/\[download\](.+%) of /)?.[1]}`);
        }
        else if (
          z.match(/\[ExtractAudio\] Destination:/) ||
          z.match(/\[ExtractAudio\] Not converting audio/)
        ) {
          filename = z.match(/\[ExtractAudio\] Destination: \.\/music\/unsorted\/(.+)/)?.[1] || "";
          if (!filename) {
            filename = z.match(/\[ExtractAudio\] Not converting audio \.\/music\/unsorted\/(.+?); file is already in target format/)?.[1] || "";
          }
          emit("upload", `Saving ${filename ? filename : "file"}`);
          files.push(filename);
        }
      });

      // WATCH FOR ERRORS
      ytdl.stderr?.once("data", (z: any) => {
        if (z.includes("is not a valid URL")) {
          error = true;
          emit("error", "");
          emit("error", "Invalid URL");
          // TODO: TRY SEARCHING?
          return;
        }
        console.log("oops error");
        console.log(z);
      });

      // AWAIT YT-DLP
      await new Promise((resolve, reject) => {
        ytdl.once("close", (z: any) => {
          console.log("closed");
          emit("upload", "");
          resolve(z);
        });
      });

      // CREATE FOLDERS IF THEY DONT EXIST
      if (!existsSync(env.LIBRARY_FOLDER)) {
        mkdirSync(env.LIBRARY_FOLDER);
      }
      if (!existsSync(`${env.LIBRARY_FOLDER}/library`)) {
        mkdirSync(`${env.LIBRARY_FOLDER}/library`);
      }

      for (const file of files) {
        emit("upload", `Reading tags from ${file}`);
        let tags = new MP3Tag(readFileSync(`${env.LIBRARY_FOLDER}/unsorted/${file}`)).read();

        let title = tags.v2?.TIT2;
        let artist = tags.v2?.TPE1;
        let album = tags.v2?.TALB || title;
        let year = tags.v2?.TYER;
        let genre = tags.v2?.TCON;
        let trackNum = tags.v2?.TRCK;
        let url = tags.v2?.TXXX?.find((t) => t.description == "purl")?.text;
        // ALBUM ARTISTS
        // DISC NUM
        // COMMENTS?

        // MAKE SURE SONG ISN'T ALREADY IN DATABASE
        const songInDB = await db.song.findUnique({
          where: {
            filename: `${artist} - ${title}.mp3`,
            releaseDate: new Date(year || 0)
          }
        });
        if (songInDB) {
          if (files.length == 1) {
            emit("error", "");
            emit("error", "Song already exists on server");
            return fail(422, { error: true, message: "Song already exists on server" });
          }

          if (createPlaylist) {
            await db.song.update({
              where: { id: songInDB.id },
              data: {
                playlists: {
                  connectOrCreate: {
                    where: { name: playlistName! },
                    create: {
                      name: playlistName!,
                      ownerId: user.id
                    }
                  }
                }
              }
            });
          }

          continue;
        }

        // MAKE SURE FILENAME ISNT TAKEN
        emit("upload", "Making sure filename isn't taken");
        let existingFiles = readdirSync(`${env.LIBRARY_FOLDER}/library`);
        let oldFilename = file;
        let baseFilename = `${artist} - ${title}`;
        let newFilename = baseFilename;

        while (existingFiles.includes(`${newFilename}.mp3`)) {
          newFilename = `${baseFilename}-${Math.floor(Math.random() * 10000)}`;
        }

        // MOVE FILE
        emit("upload", `Renaming and moving ${oldFilename}`);
        renameSync(`${env.LIBRARY_FOLDER}/unsorted/${oldFilename}`, `${env.LIBRARY_FOLDER}/library/${newFilename}.mp3`);

        // ADD TO DATABASE
        emit("upload", `Adding ${newFilename} to database`);
        let song = await db.song.create({
          data: {
            filename: `${newFilename}.mp3`,
            releaseDate: new Date(year || 0),
            title: title || "Unknown Title",
            uploader: { connect: { id: user.id } },
            url: url,
            trackNumber: Number(trackNum) || 1,
            album: {
              connectOrCreate: {
                where: { name: album || "Unknown Album" },
                create: {
                  name: album || "Unknown Album",
                  releaseDate: new Date(year || 0)
                }
              }
            },
            artists: {
              connectOrCreate: {
                where: { name: artist || "Unknown Artist" },
                create: {
                  name: artist || "Unknown Artist",
                  albums: {
                    connectOrCreate: {
                      where: { name: album || "Unknown Album" },
                      create: {
                        name: album || "Unknown Album",
                        releaseDate: new Date(year || 0)
                      }
                    }
                  }
                }
              }
            },
            playlists: createPlaylist ? {
              connectOrCreate: {
                where: { name: playlistName! },
                create: {
                  name: playlistName!,
                  ownerId: user.id
                }
              }
            } : undefined
          }
        });
      }

      emit("generic", "");
      if (files.length == 1) {
        emit("generic", `Added "${files[0]}" to the server!`);
      }
      else {
        emit("generic", `Added ${files.length} files to the server!`);
      }

      return;
    }
  }
}
