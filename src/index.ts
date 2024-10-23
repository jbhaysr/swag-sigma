// src/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Hono } from 'hono';
import { users } from './db/schema';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/users', async (c) => {
	try {
		const sql = neon(c.env.DATABASE_URL);
		const db = drizzle(sql);
		const result = await db.select().from(users);

		return c.json({result});
	} catch (error) {
		return c.json(
			{
				error,
			},
			500
		);
	}
});

export default app;