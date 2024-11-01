import type { GlobalSetupContext } from "vitest/node";
import { users } from "./src/db/schema.ts";
import { genSaltSync, hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const testCreds = {
    username: 'testuser',
    password: 'testpassword',
}

export const database = () => {
    const sql = neon(import.meta.env.VITE_DATABASE_URL);
    const db = drizzle(sql);
	return db;
};

export default async function ({ provide }: GlobalSetupContext) {
    const db = database();
    const { username, password } = testCreds;
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    await db.insert(users).values({ username, hash });
    return async () => {
        await db.delete(users).where(eq(users.username, username));
    };
}