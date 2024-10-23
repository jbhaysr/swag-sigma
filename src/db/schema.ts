// src/db/schema.ts
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
});