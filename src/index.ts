import { Hono } from "hono";
import usersApi from "./api/users";
import authApi from "./api/auth";
import { cors } from "hono/cors";
import statsApi from "./api/stats";

export type Env = {
	DATABASE_URL: string;
    JWT_SECRET_KEY: string;
};

const app = new Hono();

app.use('*', cors({
    origin: [ "https://swag-sigma.pages.dev", "https://dev.swag-sigma.pages.dev", "http://localhost:5173" ],
    credentials: true
}));
app.route('/users', usersApi);
app.route('/auth', authApi);
app.route('/stats', statsApi);

export default app;