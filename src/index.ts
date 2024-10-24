import { Hono } from "hono";
import usersApi from "./api/users";

const app = new Hono();

app.route('/users', usersApi);

export default app;