import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';

export const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();

    let file = formData.get("file");
    let url = formData.get("url") as string | null;

    // ERROR IF NEITHER A FILE NOR URL WERE GIVEN
    if (!url && (!(file instanceof Object) || !file.name || file.name.includes("/"))) {
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
    if ((file instanceof Object) && file.name && !file.name.includes("/")) {
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
      return { message: "Uploaded file successfully", filename: fullFilename };
    }

    // IF NO FILE WAS UPLOADED AND A URL WAS GIVEN
    if (url) {
      try {
        const output = execSync(`yt-dlp -o "${env.LIBRARY_FOLDER}/unsorted/%(creator,uploader,channel)s - %(title,fulltitle)s.%(ext)s" -x --audio-format mp3 --embed-metadata --embed-thumbnail ${url}`);

        console.log(output.toString());
      } catch (error: any) {
        console.log("oops error");
        console.log(error.message);
      }
    }
  }
}
