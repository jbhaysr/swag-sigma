import { describe, expect, it } from "vitest";
import { IncomingRequest } from "../index.spec";
import { database, testCreds } from "../../global-setup";
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import worker from "../../src/index";
import { PAGE_SIZE } from "../../src/api/users";
import { users } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcryptjs";

describe('Users route', () => {
    it('GET / should return a paged user list', async () => {
        const ctx = createExecutionContext();
        await waitOnExecutionContext(ctx);
        var body : { result: { username: string }[] };
        var page = 1;
        do {
            var request = new IncomingRequest('http://example.com/users?page=' + page, {
                method: 'GET',
            });
            const response = await worker.fetch(request, env, ctx);
            body = await response.json();
            expect(body.result.length).toBeGreaterThan(0);
            expect(body.result.length).toBeLessThanOrEqual(PAGE_SIZE);
            page++;
        } while(!body.result.find((user) => user.username === testCreds.username));
    });
    it('POST / should add a user to the userlist', async () => {
        const testUser = {
            username: Math.random() + ' ',
            password: Math.random() + ' ',
        };
        const ctx = createExecutionContext();
        await waitOnExecutionContext(ctx);
        const request = new IncomingRequest('http://example.com/users', {
            method: 'POST',
            body: JSON.stringify(testUser),
        });
        const response = await worker.fetch(request, env, ctx);
        expect(response.status).toBe(200);

        const db = database();
        const result = await db.select({ username: users.username })
            .from(users).where(eq(users.username, testUser.username));
        expect(result.length).toBe(1);
        await db.delete(users).where(eq(users.username, testUser.username));
    });
    // it('DELETE /:id should remove a user from the userlist', async () => {
    //     const username = Math.random() + ' ';
    //     const password = Math.random() + ' ';
    //     const salt = genSaltSync(10);
    //     const hash = hashSync(password, salt);

    //     const db = database();
    //     await db.insert(users).values({ username, hash });
    //     const userId = (await db.select({ id: users.id })
    //         .from(users).where(eq(users.username,username)))[0];

    //     const ctx = createExecutionContext();
    //     await waitOnExecutionContext(ctx);
    //     const request = new IncomingRequest('http://example.com/users/' + userId, {
    //         method: 'DELETE',
    //     });
    // });
});