// src/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Context, Hono } from 'hono';
import { users } from './db/schema';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

const database = (c: Context) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	return db;
}

app.get('/users', async (c) => {
	try {
		const db = database(c);
		const result = await db.select().from(users);

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json(
			{
				error,
			},
			500
		);
	}
});

app.post('/users', async (c) => {
	try {
		type NewUser = typeof users.$inferInsert;

		const db = database(c);
		
		const body = await c.req.json();
		const user = body as NewUser;

		if (user.id) {
			return c.json(
				{
					"error": "Field not permitted",
				},
				403
			);
		}

		const result = await db.insert(users).values(user);

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json(
			{
				error,
			},
			400
		);
	}
});

export default app;