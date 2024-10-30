import { Context } from "hono";
import { verify } from "hono/jwt";

export const authorize = async (c: Context, id?: string) => {
    try {
        type AuthorizedBody = {
            token: string;
        };

        const body = await c.req.json() as AuthorizedBody;
        const token = body.token;

        const decodedPayload = await verify(token, c.env.JWT_SECRET_KEY);
        if(decodedPayload && (!id || decodedPayload.id === id)) {
            return true;
        }
    } catch (error) { console.log(error) }
    return false;
};