import { Hono } from "hono";
import { Env } from "..";
import { database } from "../helpers/database";
import { count } from "drizzle-orm";
import { friends, users } from "../db/schema";

const statsApi = new Hono<{ Bindings: Env }>

statsApi.get('/', async (c) => {
    const db = database(c);

    const userCountResult = await db.select({ count: count() }).from(users);
    const friendCountResult = await db.select({ count: count() }).from(friends);

    const userCount = userCountResult[0].count;
    const friendCount = friendCountResult[0].count;
    const avgFriends = friendCount * 2 / userCount;
    
    return c.json({userCount, avgFriends});
});

export default statsApi;