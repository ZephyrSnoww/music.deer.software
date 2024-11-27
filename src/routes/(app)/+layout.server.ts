import { db } from '$lib/db.js';
import type { ClientData } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, depends }) {
  depends("data:account");

  const usernameCookie = cookies.get("username");
  const tokenCookie = cookies.get("token");

  let data: ClientData = {};
  let removeCookies = true;

  if (usernameCookie && tokenCookie) {
    let user = await db.user.findUnique({ where: { username: usernameCookie }, include: { credentials: true } });

    if (user && user.credentials!.token == tokenCookie) {
      removeCookies = false;
      data.account = await db.user.findUnique({
        where: { username: usernameCookie },
        include: {
          editablePlaylists: true,
          favorites: true,
          ownedPlaylists: true,
          playData: true,
          ratings: true,
          tags: true,
          uploadedSongs: true
        }
      });
    }
  }

  if (removeCookies) {
    cookies.delete("username", { path: "/" });
    cookies.delete("token", { path: "/" });
  }

  if (!data.account) {
    return redirect(300, "/login");
  }

  return data;
}
