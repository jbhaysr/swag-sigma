import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestUser, destroyTestUser, IncomingRequest, testCreds } from "../index.spec";
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import worker from "../../src/index";
import { PAGE_SIZE, UsersGetResponse } from "../../src/api/users";

describe('Users endpoint', () => {
    beforeAll(createTestUser);
    it('Should return a paged user list', async () => {
        const ctx = createExecutionContext();
        await waitOnExecutionContext(ctx);
        var body : UsersGetResponse;
        var page = 1;
        do {
            var request = new IncomingRequest('http://example.com/users/', {
                method: 'GET',
                body: JSON.stringify({ page }),
            });
            const response = await worker.fetch(request, env, ctx);
            body = await response.json() as UsersGetResponse;
            expect(body.result.length).toBeGreaterThan(0);
            expect(body.result.length).toBeLessThanOrEqual(PAGE_SIZE);
        } while(!body.result.find((user) => user.username === testCreds.username));
    });
    afterAll(destroyTestUser);
});