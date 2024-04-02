import Redis from "ioredis";
import cryptoRandomString from 'crypto-random-string';

import { session_get } from '../session.ts';

export class SessionStore {
  private redis: Redis
  private sessionID: string = ''
  cookie_name = "sessionASTRO"

  constructor() {
    const redis_db = import.meta.env.REDIS_DB
    const redis_pwd = import.meta.env.REDIS_PWD
    this.redis = new Redis(`rediss://default:${redis_pwd}@${redis_db}`);
  }


  async load(sessionID: string): Promise<any> {
    // no session ID (mostly no cookie)
    if (sessionID.length == 0)
      sessionID = this.id()

    // session if forgotten ? New session ID
    let raw = await this.redis.get(sessionID)
    if (raw == null) {
      sessionID = this.id()
      raw = '{}'
    }
    let session: any = null
    try {
      session = JSON.parse(raw)
    } catch(e) {
      throw new Error('session is corrupted');
    }

    session.ID = sessionID
    return session;
  }


  async write(session: any): Promise<boolean> {
    if (typeof session.ID == 'undefined')
      throw new Error('sessionID is not defined');

    const sessionID = session.ID
    delete(session.ID)

    // while writing, reset expiration
    const s = JSON.stringify(session)
    var isOk = await this.redis.set(sessionID, s, 'EX', 3600);
    if (isOk)
      return true;

    // TODO log
    return false
  }


  id() {
    return cryptoRandomString({length: 10, type: 'alphanumeric'})
  }
}