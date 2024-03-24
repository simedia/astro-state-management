import { defineMiddleware, sequence } from "astro/middleware";
import cryptoRandomString from 'crypto-random-string';
import { sessionStore } from './lib/store.ts';

/**
 * create/read session ID
 */
export const sessionMW = defineMiddleware(async (context, next) => {
    // set a session value if none
    const sessionID = context.cookies.get(sessionStore.cookie_name)?.value! || '';
    if (sessionID.length == 0)
        context.cookies.set(sessionStore.cookie_name, cryptoRandomString({length: 10, type: 'alphanumeric'}));

    await sessionStore.init(sessionID);

    return next();
});


/**
 * save state
 */
export const langMW = defineMiddleware(async (context, next) => {
    const response = await next();

    // post action (save state even if no change to reset expiration)
    await sessionStore.write();
    return response;
});

export const onRequest = sequence(sessionMW, langMW);
