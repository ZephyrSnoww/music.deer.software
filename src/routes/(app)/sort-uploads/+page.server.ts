import { env } from "$env/dynamic/private";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import MP3Tag from "mp3tag.js";
// @ts-expect-error Package has shit typing
import { parseFile } from "music-metadata";

export async function load() {
  // try {
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

    console.log(fileData);
    return { unsortedFiles: fileData };
  // } catch (error) {
  //   return {}
  // }
}
