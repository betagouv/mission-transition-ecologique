const setIn = (obj: any, [head, ...rest]: string[], value: any) => {
  console.log('utils > helpers > setIn >  obj :', obj)
  const newObj: any = Array.isArray(obj) ? [...obj] : {...obj}
  newObj[head] = rest.length ? setIn(obj[head], rest, value) : value;
  return newObj
}

export const setProperty = (obj: object, path: string, value: any) => {
  console.log('utils > helpers > setProperty >  obj :', obj)
  // const [head, ...rest] = path.split('.')
  const pathAsArray = path.split('.')
  const resObj = setIn(obj, pathAsArray, value)
  return resObj
}
