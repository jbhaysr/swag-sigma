// src/index.ts
import { Hono } from 'hono';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/users', (c) => {
	return c.json({});
});

export default app;