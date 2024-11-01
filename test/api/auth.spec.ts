import { describe, expect, it } from "vitest";
import worker from "../../src/index";
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { decode } from "hono/utils/jwt/jwt";
import { IncomingRequest } from "../index.spec";
import { testCreds } from "../../global-setup";
import { parse } from "hono/utils/cookie";

describe('Auth route', () => {
    it('POST login should accept valid credentials and provide a token.', async () => {
        const request = new IncomingRequest('http://example.com/auth/login', {
            method: 'POST',
            body: JSON.stringify(testCreds),
        });
        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);
        
        const cookies = response.headers.getSetCookie();
        const token = parse(cookies[0])['token'];
        const payload = decode(token).payload;
        expect(payload.username).toBe(testCreds.username);
    });
    it('POST login should reject invalid credentials and not provide a token', async () => {
        const request = new IncomingRequest('http://example.com/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: testCreds.username,
                password: 'wrongpassword',
            }),
        });
        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(401);

        const cookies = response.headers.getSetCookie();
        expect(cookies.length).toBe(0);
    });
});