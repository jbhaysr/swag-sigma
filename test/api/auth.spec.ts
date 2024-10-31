import { afterAll, beforeAll, describe, expect, it } from "vitest";
import worker from "../../src/index";
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { LoginPostResponse } from "../../src/api/auth";
import { neon } from "@neondatabase/serverless";
import { decode } from "hono/utils/jwt/jwt";

const testCreds = {
    username: 'testuser',
    password: 'testpassword',
}

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Login Endpoint', () => {
    beforeAll(async () => {
        const request = new IncomingRequest('http://example.com/users', {
            method: "POST",
            body: JSON.stringify(testCreds),
        });
        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);
    });
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
        const payload = await decode(body.token).payload;
        expect(payload.username).toBe(testCreds.username);
    });
    afterAll(async () => {
        const loginRequest = new IncomingRequest('http://example.com/auth/login', {
            method: 'POST',
            body: JSON.stringify(testCreds),
        });
        const ctx = createExecutionContext();
        const response = await worker.fetch(loginRequest, env, ctx);
        const body = await response.json() as LoginPostResponse;
        const payload = await(decode(body.token)).payload;
        const deleteRequest = new IncomingRequest('http://example.com/users/' + payload.id, {
            method: 'DELETE',
            body: JSON.stringify({token: body.token})
        });
        worker.fetch(deleteRequest, env, ctx);
        await waitOnExecutionContext(ctx);
    });
});