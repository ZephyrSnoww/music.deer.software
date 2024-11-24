import { db } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from 'argon2';

export const actions = {
  login: async ({ cookies, request }) => {
    const formData = await request.formData();

    let username = formData.get("username") as string | null;
    let password = formData.get("password") as string | null;

    if (!(username && password)) {
      return fail(400, { error: true, message: "You must fill out all information" });
    }

    const user = await db.user.findUnique({ where: { username }, include: { credentials: true } });
    if (!user) {
      return fail(400, { error: true, message: "That user could not be found" });
    }

    if (!await verify(user.credentials!.password, password)) {
      return fail(400, { error: true, message: "Incorrect password" });
    }

    cookies.set("username", user.username, { path: "/" });
    cookies.set("token", user.credentials!.token, { path: "/" });
    return redirect(300, "/");
  }
}
