import { env } from "$env/dynamic/private";
import { clients } from "$lib/clients.js";
import { fail, redirect } from "@sveltejs/kit";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "fs";
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
    let artists = formData.get("artists") as string | null;
    let title = formData.get("title") as string | null;
    let album = formData.get("album") as string | null;

    console.log(`Submit ${filename}`);
    console.log(`Artists: ${artists}`);
    console.log(`Title: ${title}`);
    console.log(`Album: ${album}`);
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
  }
}
