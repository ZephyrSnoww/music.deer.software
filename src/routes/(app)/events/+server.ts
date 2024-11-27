import { clients } from "$lib/clients.js";
import { db } from "$lib/db.js";
import { produce } from "sveltekit-sse";

export function POST({ cookies }) {
  return produce(
    // @ts-expect-error This is just wrong?
    async function start({ emit }) {
      // GET TOKEN COOKIE
      const usernameCookie = cookies.get("username");
      const tokenCookie = cookies.get("token");

      // MAKE SURE TOKEN COOKIE EXISTS
      if (!tokenCookie || !usernameCookie) {
        return function stop() {
          cookies.delete("username", { path: "/" });
          cookies.delete("token", { path: "/" });
        }
      }

      // MAKE SURE TOKEN COOKIE IS VALID
      const user = await db.user.findUnique({ where: { username: usernameCookie, credentials: { token: tokenCookie } } });
      if (!user) {
        return function stop() {
          cookies.delete("username", { path: "/" });
          cookies.delete("token", { path: "/" });
        }
      }

      // ADD TO CLIENTS LIST
      clients.set(tokenCookie, emit);
      console.log(`${user.username} online`);
      emit("generic", "Connected!");
    },
    {
      stop: async () => {
        // GET TOKEN COOKIE
        const usernameCookie = cookies.get("username");
        const tokenCookie = cookies.get("token");

        // MAKE SURE TOKEN COOKIE EXISTS
        if (!tokenCookie || !usernameCookie) {
          cookies.delete("username", { path: "/" });
          cookies.delete("token", { path: "/" });
          return;
        }

        // MAKE SURE TOKEN COOKIE IS VALID
        const user = await db.user.findUnique({ where: { username: usernameCookie, credentials: { token: tokenCookie } } });
        if (!user) {
          cookies.delete("username", { path: "/" });
          cookies.delete("token", { path: "/" });
          return;
        }

        // REMOVE FROM CLIENTS LIST
        clients.delete(tokenCookie);
        console.log(`${user.username} offline`);
      }
    }
  );
}
