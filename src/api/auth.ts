import { Hono } from "hono";
import { Env } from "..";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcryptjs";
import { sign } from "hono/utils/jwt/jwt";
import { database } from "../helpers/database";
import { setCookie } from "hono/cookie";

const authApi = new Hono<{ Bindings: Env }>;

export type LoginPostBody = {
    username: string,
    password: string,
};

authApi.post('/login', async (c) => {
    try {
        const body = await c.req.json() as LoginPostBody;

        const db = database(c);
        const searchResult = await db.select().from(users).where(
            eq(users.username, body.username)
        );

        if (searchResult.length != 1) {
            return c.json({ error: "Invalid credentials." }, 403);
        }

        const user = searchResult[0];

        if (!compareSync(body.password, user.hash)) {
            return c.json({ error: "Invalid credentials." }, 403);
        }

        const now = Math.floor(Date.now() / 1000);
        const tomorrow = now + 60 * 60 * 24;

        const token = await sign({
            id: user.id,
            username: user.username,
            iat: now,
            exp: tomorrow,
        }, c.env.JWT_SECRET_KEY);

        setCookie(c, 'token', token, {
            expires: new Date(tomorrow)
        });

        return c.json({});
    } catch (error) {
        return c.json({ error }, 400);
    }
});

export default authApi;