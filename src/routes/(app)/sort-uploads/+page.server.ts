import { env } from "$env/dynamic/private";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import MP3Tag from "mp3tag.js";

export async function load() {
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
  submit: async ({ request }) => {
    const formData = await request.formData();

    let filename = formData.get("filename") as string | null;
  },

  // FILE DELETION
  delete: async ({ request }) => {

  }
}
