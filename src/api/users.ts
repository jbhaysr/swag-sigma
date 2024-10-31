// src/api.ts
import { Hono } from 'hono';
import { friends, users } from '../db/schema';
import { union } from 'drizzle-orm/pg-core';
import { and, eq, or } from 'drizzle-orm';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Env } from '..';
import { database } from '../helpers/database';
import { authorize } from '../helpers/auth';

const usersApi = new Hono<{ Bindings: Env }>();

export const PAGE_SIZE = 5;

export type UsersGetBody = {
	page: number,
};
export type UsersGetResponse = {
	result: {
		id: string,
		username: string,
	}[],
};
usersApi.get('/', async (c) => {
	try {

		const body = await c.req.json() as UsersGetBody;

		const page = body.page ? body.page : 1;

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
		type UserPostBody = {
			username: string,
			password: string,
		};
		
		const body = await c.req.json() as UserPostBody;
		
		const salt = genSaltSync(10);
		const hash = hashSync(body.password, salt);
		
		const user = {
			username: body.username,
			hash: hash as string
		};

		const db = database(c);

		const result = await db.insert(users).values(user);

		return c.json({ result });
	} catch (error) {
		// @TODO breakdown potential exceptions
		return c.json({	error }, 400);
	}
});

export type UserDeleteBody = {
	token: string,
};
usersApi.delete('/:id', async (c) => {
	const userId = c.req.param('id') as string;

	if (!await authorize(c, userId)) {
		return c.json({}, 401);
	}

	const db = database(c);
	const result1 = await db.delete(friends).where(or(
		eq(friends.userId1, userId),
		eq(friends.userId2, userId)
	));
	const result2 = await db.delete(users).where(
		eq(users.id, userId)
	);

	return c.json({result1, result2}, 200);
});

usersApi.get('/:id/friends', async (c) => {
	try {
		type FriendsGetBody = {
			page: number,
		};

		const body = await c.req.json() as FriendsGetBody;

		const page = body.page ? body.page : 1;

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
		type FriendPostBody = {
			id: string,
			token: string,
		};

		const body = await c.req.json() as FriendPostBody;
		
		const userId = c.req.param('id') as string;
		const friendId = body.id;
		
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
		
		if (!await authorize(c, userId)) {
			return c.json({}, 401);
		}
		
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
		
		if (!await authorize(c, userId)) {
			return c.json({}, 401);
		}

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