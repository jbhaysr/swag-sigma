// src/api.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Context, Hono } from 'hono';
import { friends, users } from '../db/schema';
import { union } from 'drizzle-orm/pg-core';
import { and, eq } from 'drizzle-orm';

export type Env = {
	DATABASE_URL: string;
};

const usersApi = new Hono<{ Bindings: Env }>();

const database = (c: Context) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	return db;
}

usersApi.get('/', async (c) => {
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

usersApi.post('/', async (c) => {
	try {
		type UserPostBody = {
			username: string
		};

		const db = database(c);
		
		const body = await c.req.json();
		const user = body as UserPostBody;

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

usersApi.get('/:id/friends', async (c) => {
	try {
		const userId = c.req.param('id') as string;
		
		const db = database(c);

		const friends1 = db.select({
			id: users.id,
			username: users.username
		}).from(users).innerJoin(friends, eq(
			users.id,
			friends.userId1
		)).where(eq(friends.userId2, userId));

		const friends2 = db.select({
			id: users.id,
			username: users.username
		}).from(users).innerJoin(friends, eq(
			users.id,
			friends.userId2
		)).where(eq(friends.userId1, userId));

		const result = await union(friends1, friends2);

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

usersApi.post('/:id/friends', async (c) => {
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
			userId1: uid1,
			userId2: uid2,
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


usersApi.delete('/:id/friends/:friendId', async (c) => {
	try {
		const db = database(c);

		const userId = c.req.param('id') as string;
		const friendId = c.req.param('friendId') as string;

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

		const result = await db.delete(friends).where(and(
			eq(friends.userId1, uid1),
			eq(friends.userId2, uid2),
		));

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

export default usersApi;