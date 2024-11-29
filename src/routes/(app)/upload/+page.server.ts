import { env } from "$env/dynamic/private";
import { clients } from "$lib/clients.js";
import { fail, redirect } from "@sveltejs/kit";
import { exec } from "child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";

export const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();

    const tokenCookie = cookies.get("token");
    if (!tokenCookie) {
      return redirect(300, "/login");
    }
    const emit = clients.get(tokenCookie);
    if (!emit) {
      return fail(500);
    }

    let file = formData.get("file");
    let url = formData.get("url") as string | null;
    let createPlaylist = formData.get("createPlaylist") as string | null;
    let skipSorting = formData.get("skipSorting") as string | null;

    // ERROR IF NEITHER A FILE NOR URL WERE GIVEN
    if (!url && (!(file instanceof Object) || !file.name || file.name.includes("/") || file.size == 0)) {
      emit("error", "");
      emit("error", "Invalid file or URL");
      return fail(422, { error: true, message: "You must provide a valid file or URL" });
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

      ytdl.once("spawn", (m: any) => {
        console.log("spawned");
      });

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
          emit("upload", `Saving ${filename ? filename : "file"}`);
        }
      });

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

      await new Promise((resolve, reject) => {
        ytdl.once("close", (z: any) => {
          console.log("closed");
          if (!error) {
            emit("generic", "");
            emit("generic", "Completed");
          }
          emit("upload", "");
          resolve(z);
        });
      });

      return;
    }
  }
}
