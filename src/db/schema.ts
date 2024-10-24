// src/db/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, uuid, text, primaryKey, check } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
});

export const friends = pgTable('friends', {
    user_id_1: uuid('user_id_1'),
    user_id_2: uuid('user_id_2')
}, (table) => ({
        pk: primaryKey({
            columns: [table.user_id_1, table.user_id_2 ]
        }),
        checkConstraint: check(
            "id_order_check",
            sql`${table.user_id_1} < ${table.user_id_2}`
        ),
    })
);