import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export const authorize = async (c: Context, id?: string) => {
    try {
        const token = getCookie(c, 'token') as string;

        const decodedPayload = await verify(token, c.env.JWT_SECRET_KEY);
        if(decodedPayload && (!id || decodedPayload.id === id)) {
            return true;
        }
    } catch (error) { console.log(error) }
    throw new HTTPException(401);
};