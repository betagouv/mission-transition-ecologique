/** Entry is a type to represent all possible [key,value] tuples of object of
 * type T */
export type Entry<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

/** filters an object based on entries (type `Entry`)
 */
export function filterObject<T extends object>(obj: T, fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean): Partial<T> {
  return Object.fromEntries((Object.entries(obj) as Entry<T>[]).filter(fn)) as Partial<T>
}

/** Generically set an object property
 */
export function setObjectProperty<T extends object, K extends keyof T>(object: T, key: K, value: T[K]) {
  object[key] = value
}
