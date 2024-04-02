// manage session with nanostore
import { map } from 'nanostores'

export const $session = map<any>({})


export function session_set(k: string, v: any) {
  $session.setKey(k, v)
}


export function session_init(o: any) {
  if (typeof o !== 'object')
    return

  for (const property in o) {
    session_set(property, o[property])
  }
}


export function session_get(k: string) {
  const session = $session.get()
  if (typeof session[k] == 'undefined')
    return null
  return session[k]
}
