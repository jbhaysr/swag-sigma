import { Hono } from "hono";
import usersApi from "./api/users";
import authApi from "./api/auth";
import { cors } from "hono/cors";

export type Env = {
	DATABASE_URL: string;
    JWT_SECRET_KEY: string;
};

const app = new Hono();

app.use('*', cors({
    origin: [ "https://swag-sigma.pages.dev", "https://dev.swag-sigma.pages.dev", "http://localhost:5173" ]
}));
app.route('/users', usersApi);
app.route('/auth', authApi);

export default app;