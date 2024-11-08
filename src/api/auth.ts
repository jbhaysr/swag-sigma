import { Hono } from "hono";
import { Env } from "..";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcryptjs";
import { sign } from "hono/utils/jwt/jwt";
import { database } from "../helpers/database";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";

const authApi = new Hono<{ Bindings: Env }>;

authApi.use('/login', cors({
    origin: [ "https://swag-sigma.pages.dev", "https://dev.swag-sigma.pages.dev", "http://localhost:5173" ],
    credentials: true
}));

authApi.post('/login', async (c) => {
    const { username, password } = await c.req.json();

    const db = database(c);
    const searchResult = await db.select().from(users).where(
        eq(users.username, username)
    );

    if (searchResult.length == 1) {
        const user = searchResult[0];

        if (compareSync(password, user.hash)) {
            const now = Math.floor(Date.now() / 1000);
            const tomorrow = now + 60 * 60 * 24;

            const token = await sign({
                id: user.id,
                username: user.username,
                iat: now,
                exp: tomorrow,
            }, c.env.JWT_SECRET_KEY);

            setCookie(c, 'token', token, {
                expires: new Date(tomorrow*1000),
                secure: true,
                sameSite: 'None',
            });

            const { id } = user;
            return c.json({ id, username });
        }
    }
    throw new HTTPException(401);
});

export default authApi;