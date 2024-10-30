import { Context, Hono } from "hono";
import usersApi from "./api/users";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import authApi from "./api/auth";

export type Env = {
	DATABASE_URL: string;
    JWT_SECRET_KEY: string;
};

export const database = (c: Context) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	return db;
}

const app = new Hono();

app.route('/users', usersApi);
app.route('/auth', authApi);

export default app;