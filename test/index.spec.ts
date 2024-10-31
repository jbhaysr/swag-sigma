// test/index.spec.ts
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';
import { decode } from 'hono/utils/jwt/jwt';
import { LoginPostResponse } from '../src/api/auth';

export const testCreds = {
    username: 'testuser',
    password: 'testpassword',
}

export const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

export const createTestUser = async () => {
	const request = new IncomingRequest('http://example.com/users', {
		method: "POST",
		body: JSON.stringify(testCreds),
	});
	const ctx = createExecutionContext();
	await worker.fetch(request, env, ctx);
	await waitOnExecutionContext(ctx);
};

export const destroyTestUser = async () => {
	const loginRequest = new IncomingRequest('http://example.com/auth/login', {
		method: 'POST',
		body: JSON.stringify(testCreds),
	});
	const ctx = createExecutionContext();
	const response = await worker.fetch(loginRequest, env, ctx);
	const body = await response.json() as LoginPostResponse;
	const payload = decode(body.token).payload;
	const deleteRequest = new IncomingRequest('http://example.com/users/' + payload.id, {
		method: 'DELETE',
		body: JSON.stringify({token: body.token})
	});
	worker.fetch(deleteRequest, env, ctx);
	await waitOnExecutionContext(ctx);
};

describe('Index', () => {
	it('Contains no content.', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(404);
	});
});