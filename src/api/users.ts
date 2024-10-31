// src/api.ts
import { Hono } from 'hono';
import { friends, users } from '../db/schema';
import { union } from 'drizzle-orm/pg-core';
import { and, eq, or } from 'drizzle-orm';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Env } from '..';
import { database } from '../helpers/database';
import { authorize } from '../helpers/auth';
import { HTTPException } from 'hono/http-exception';

const usersApi = new Hono<{ Bindings: Env }>();

export const PAGE_SIZE = 5;

export type UsersGetResponse = {
	result: {
		id: string,
		username: string,
	}[],
};
usersApi.get('/', async (c) => {
	try {
		const page = parseInt(c.req.query('page') ?? "1");

		const db = database(c);
		const result = await db.select({
			id: users.id,
			username: users.username
		}).from(users).orderBy(users.id)
		.limit(PAGE_SIZE).offset((page-1)*PAGE_SIZE);

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json({	error }, 500);
	}
});


usersApi.post('/', async (c) => {
	try {		
		const { username, password } = await c.req.json();
		
		const salt = genSaltSync(10);
		const hash = hashSync(password, salt);

		const db = database(c);

		const result = await db.insert(users).values({
			username, hash
		});

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json({	error }, 400);
	}
});

usersApi.delete('/:id', async (c) => {
	const { id } = c.req.param();

	await authorize(c, id);

	const db = database(c);
	const result1 = await db.delete(friends).where(or(
		eq(friends.userId1, id),
		eq(friends.userId2, id)
	));
	const result2 = await db.delete(users).where(
		eq(users.id, id)
	);

	return c.json({result1, result2}, 200);
});

usersApi.get('/:id/friends', async (c) => {
	try {
		const { id } = c.req.param();
		const page = parseInt(c.req.query('page') ?? "1");
		
		const db = database(c);

		const friends1 = db.select({
			id: users.id,
			username: users.username
		}).from(users).innerJoin(friends, eq(
			users.id,
			friends.userId1
		)).where(eq(friends.userId2, id));

		const friends2 = db.select({
			id: users.id,
			username: users.username
		}).from(users).innerJoin(friends, eq(
			users.id,
			friends.userId2
		)).where(eq(friends.userId1, id));

		const result = await union(friends1, friends2)
		.orderBy(users.id).limit(PAGE_SIZE)
		.offset((page-1)*PAGE_SIZE);

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json({ error }, 500);
	}
});

usersApi.post('/:id/friends', async (c) => {
	try {
		const { id } = c.req.param();
		const { id: friendId } = await c.req.json();
		
		var uid1, uid2: string;
		
		if (friendId < id) {
			uid1 = friendId;
			uid2 = id;
		} else if(id < friendId) {
			uid1 = id;
			uid2 = friendId;
		} else {
			throw new HTTPException(403);
		}
		
		await authorize(c, id);
		
		const db = database(c);
		
		const result = await db.insert(friends).values({
			userId1: uid1,
			userId2: uid2,
		});

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json({ error }, 500);
	}
});


usersApi.delete('/:id/friends/:friendId', async (c) => {
	try {
		const { id, friendId } = c.req.param();
		
		var uid1, uid2: string;
		
		if (friendId < id) {
			uid1 = friendId;
			uid2 = id;
		} else if(id < friendId) {
			uid1 = id;
			uid2 = friendId;
		} else {
			throw new HTTPException(403);
		}
		
		await authorize(c, id)

		const db = database(c);
		
		const result = await db.delete(friends).where(and(
			eq(friends.userId1, uid1),
			eq(friends.userId2, uid2),
		));

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json({ error }, 500);
	}
});

export default usersApi;