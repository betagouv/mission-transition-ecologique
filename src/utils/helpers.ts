export const getFrom = (from: any, selectors: string[]) =>
  // console.log('utils > helpers > getFrom >  selectors :', selectors)
  selectors.map((s: string) =>
  // @ts-ignore
  s.replace(/\[([^[\]]*)\]/g, '.$1.')
  .split('.')
  .filter((t: any) => t !== '')
  .reduce((prev: any, cur: any) => prev && prev[cur], from)
  )

const setIn = (obj: any, [head, ...rest]: string[], value: any) => {
  // console.log('utils > helpers > setIn >  obj :', obj)
  const newObj: any = Array.isArray(obj) ? [...obj] : {...obj}
  newObj[head] = rest.length ? setIn(obj[head], rest, value) : value;
  return newObj
}

export const setProperty = (obj: object, path: string, value: any) => {
  // console.log('utils > helpers > setProperty >  obj :', obj)
  // const [head, ...rest] = path.split('.')
  const pathAsArray = path.split('.')
  const resObj = setIn(obj, pathAsArray, value)
  return resObj
}
