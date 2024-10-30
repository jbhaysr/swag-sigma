import { Hono } from "hono";
import usersApi from "./api/users";
import authApi from "./api/auth";

export type Env = {
	DATABASE_URL: string;
    JWT_SECRET_KEY: string;
};

const app = new Hono();

app.route('/users', usersApi);
app.route('/auth', authApi);

export default app;