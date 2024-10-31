import { afterAll, beforeAll, describe, expect, it } from "vitest";
import worker from "../../src/index";
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { LoginPostResponse } from "../../src/api/auth";

const testCreds = {
    username: 'testuser',
    password: 'testpassword',
}

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Login Endpoint', () => {
    beforeAll(async () => {
        try {
            const request = new IncomingRequest('http://example.com/users', {
                method: "POST",
                body: JSON.stringify(testCreds),
            });
            const ctx = createExecutionContext();
            const response = await worker.fetch(request, env, ctx);
            await waitOnExecutionContext(ctx);
        } catch (error) {}
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
        expect(body.token).toBeTruthy();
    });
});