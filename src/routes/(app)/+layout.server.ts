import { db } from "$lib/db.js";
import type { ClientData } from "$lib/types.js";
import { redirect } from "@sveltejs/kit";

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
    return redirect(302, "/login");
  }

  // data.songs = await db.song.findMany({
  //   include: {
  //     album: true,
  //     artists: true,
  //     favoritedBy: { where: { id: data.account.id } },
  //     playData: { where: { userId: data.account.id } },
  //     playlists: { where: { OR: [{ ownerId: data.account.id }, { editors: { some: { id: data.account.id } } }] } },
  //     ratings: { where: { userId: data.account.id } },
  //     tags: { where: { ownerId: data.account.id } },
  //     uploader: true
  //   },
  // });

  data.albums = await db.album.findMany({
    include: {
      _count: { select: { tracks: true } },
      artists: true
    }
  });

  data.playlists = await db.playlist.findMany({
    where: {
      OR: [
        { ownerId: data.account.id },
        { editors: { some: { id: data.account.id } } }
      ]
    },
    include: {
      _count: { select: { songs: true } },
      owner: true,
      editors: true,
      songs: true
    }
  });

  return data;
}
