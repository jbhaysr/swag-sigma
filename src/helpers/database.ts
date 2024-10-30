import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Context } from "hono";


export const database = (c: Context) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	return db;
}