// src/api.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Context, Hono } from 'hono';
import { friends, users } from './db/schema';
import { union } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

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

app.get('/users/:id/friends', async (c) => {
	try {
		const user_id = c.req.param('id') as string;
		
		const db = database(c);

		const friends_1 = db.select({
			id: users.id,
			username: users.username
		}).from(users).innerJoin(friends, eq(
			users.id,
			friends.user_id_1
		)).where(eq(friends.user_id_2, user_id));

		const friends_2 = db.select({
			id: users.id,
			username: users.username
		}).from(users).innerJoin(friends, eq(
			users.id,
			friends.user_id_2
		)).where(eq(friends.user_id_1, user_id));

		const result = await union(friends_1, friends_2);

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

app.post('/users/:id/friends', async (c) => {
	try {
		type FriendPostBody = {
			id: string
		};

		const db = database(c);

		const body = await c.req.json();
		const friendPost = body as FriendPostBody;

		const userId = c.req.param('id') as string;
		const friendId = friendPost.id;

		var uid1, uid2: string;

		if (friendId < userId) {
			uid1 = friendId;
			uid2 = userId;
		} else if(userId < friendId) {
			uid1 = userId;
			uid2 = friendId;
		} else {
			return c.json(
				{
					error: "You may not befriend yourself.",
				},
				403
			);
		}

		const result = await db.insert(friends).values({
			user_id_1: uid1,
			user_id_2: uid2,
		});

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

export default app;