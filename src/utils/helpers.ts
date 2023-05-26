const setIn = (obj: any, [prop, ...rest]: string[], value: any) => {
  const newObj: any = Array.isArray(obj) ? [...obj] : {...obj}
  newObj[prop] = rest.length ? setIn(obj[prop], rest, value) : value;
  return newObj
}

export const setProperty = (obj: object, path: string, value: any) => {
  // console.log('utils > helpers > setProperty >  obj :', obj)
  // const [head, ...rest] = path.split('.')
  const pathAsArray = path.split('.')
  const resObj = setIn(obj, pathAsArray, value)
  return resObj
}
