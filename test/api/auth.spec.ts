import { afterAll, beforeAll, describe, expect, it } from "vitest";
import worker from "../../src/index";
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { LoginPostResponse } from "../../src/api/auth";
import { decode } from "hono/utils/jwt/jwt";
import { createTestUser, destroyTestUser, IncomingRequest, testCreds } from "../index.spec";

describe('Login Endpoint', () => {
    beforeAll(createTestUser);
    it('Should accept valid credentials and provide a token.', async () => {
        const request = new IncomingRequest('http://example.com/auth/login', {
            method: 'POST',
            body: JSON.stringify(testCreds),
        });
        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);
        const body = await response.json() as LoginPostResponse;
        const payload = decode(body.token).payload;
        expect(payload.username).toBe(testCreds.username);
    });
    afterAll(destroyTestUser);
});