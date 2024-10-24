// src/db/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, uuid, text, primaryKey, check } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
});

export const friends = pgTable('friends', {
    userId1: uuid('user_id_1').references(() => users.id),
    userId2: uuid('user_id_2').references(() => users.id),
}, (table) => ({
        pk: primaryKey({
            columns: [table.userId1, table.userId2 ]
        }),
        checkConstraint: check(
            "id_order_check",
            sql`${table.userId1} < ${table.userId2}`
        ),
    })
);