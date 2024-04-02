import { defineMiddleware, sequence } from "astro/middleware";

import { SessionStore } from './lib/SessionStore.ts';
import { $session, session_init } from './session.ts';

const sessionStore = new SessionStore();

/**
 * create/read session ID
 */
const _session = defineMiddleware(async (context, next) => {
    // get cookie request
    const sessionID = context.cookies.get(sessionStore.cookie_name)?.value! || '';

    // load session from db
    const session = await sessionStore.load(sessionID);

    // set new cookie ? Add header in response
    if (sessionID != session.ID)
        context.cookies.set(sessionStore.cookie_name, session.ID);

    // make session available from everywhere in the app
    session_init(session)

    const response = await next()

    // *** post action
    // save state even if no change to reset expiration
    await sessionStore.write($session.get());
    return response;
});


export const onRequest = sequence(_session);
