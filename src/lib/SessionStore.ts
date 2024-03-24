import Redis from "ioredis";

export class SessionStore {
  private redis: Redis;
  private sessionID: string | null = null;
  cookie_name = "sessionASTRO";
  session: any

  constructor() {
    const redis_db = import.meta.env.REDIS_DB
    const redis_pwd = import.meta.env.REDIS_PWD
    this.redis = new Redis(`rediss://default:${redis_pwd}@${redis_db}`);
  }


  async init(sessionID: string): Promise<any> {
    this.sessionID = sessionID;
    this.session = await(this.load());
  }


  async load(): Promise<any> {
    if (this.sessionID == null)
      throw new Error('sessionID is not defined');

    const raw = await this.redis.get(this.sessionID) || '{}';
    return JSON.parse(raw)
  }


  async write(): Promise<boolean> {
    if (this.sessionID == null)
      throw new Error('sessionID is not defined');

    // while writing, reset expiration
    const s = JSON.stringify(this.session)
    var isOk = await this.redis.set(this.sessionID, s, 'EX', 3600);
    if (isOk)
      return true;

    // TODO log
    return false
  }



  set(key: string, v: any): void {
    this.session[key] = v;
  }


  get(key: string): any {
    if (this.session === null)
      return null;

    if (this.session.hasOwnProperty(key))
      return typeof this.session[key];
    return null;
  }

  del(key: string): void {
    if (this.session === null)
      return;

    if (!this.session.hasOwnProperty(key))
      return;

    delete(this.session[key]);
  }


  isConnected(): boolean {
    return typeof this.session.who !== 'undefined';
  }
}