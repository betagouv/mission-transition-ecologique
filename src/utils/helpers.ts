import type { FormCallbackDataMapping } from '@/types/index'


export const getFrom = (from: any, selectors: string[]) =>
  // console.log('utils > helpers > getFrom >  selectors :', selectors)
  selectors.map((s: string) =>
  // @ts-ignore
  s.replace(/\[([^[\]]*)\]/g, '.$1.')
  .split('.')
  .filter((t: any) => t !== '')
  .reduce((prev: any, cur: any) => prev && prev[cur], from)
  )

export const getFromOnePath = (from: any, selector: string) => {
  const val = getFrom(from, [selector])
  return val[0]
}

export const setIn = (obj: any, [head, ...rest]: string[], value: any) => {
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

export const findInTracksArray = (tracksArray: object[], id: string) => {
  // console.log()
  // console.log('utils > helpers > findInTracksArray >  tracksArray :', tracksArray)
  // console.log('utils > helpers > findInTracksArray >  id :', id)

  let value = undefined
  const valObj: any = tracksArray.find((v: object) => {
    // console.log('utils > helpers > findInTracksArray >  v :', v)
    return Object.keys(v).includes(id)
  })
  // console.log('utils > helpers > findInTracksArray >  valObj :', valObj)
  value =  typeof valObj === 'object' ? valObj[id] : ''
  // console.log('utils > helpers > findInTracksArray >  value :', value)
  return value
}

export const remapItem = (
  dataStructure: object,
  dataMapping: FormCallbackDataMapping[],
  formData: object | any = {},
  trackValues: any[] = [],
  props: object | any = undefined,
  rawData: object | any = undefined
  ) => {
  
  console.log('utils > helpers > remapItem >  dataStructure :', dataStructure)
  let data = { ...dataStructure }
  const metaEnv = import.meta.env
  // console.log('utils > helpers > remapItem >  metaEnv :', metaEnv)
  
  dataMapping.forEach(dm => {
    console.log('utils > helpers > remapItem >  dm :', dm)
    let value: any = ''
    switch (dm.from) {
      case 'env':
        value = metaEnv[dm.id]
        break
      case 'formData':
        value = formData && formData[dm.id]
        break
      case 'usedTracks':
        value = findInTracksArray(trackValues, dm.id)
        break
      case 'props':
        value = props && props[dm.id]
        break
      case 'rawData':
        value = dm.path && getFromOnePath(rawData, dm.path )
        break
      default:
        value = ''
    }
    // parse as array
    if (dm.asArray) {
      value = value.split( dm.sep || ',')
      if (dm.type === 'integer') { value = value.map((v: string) => parseInt(v)) }
    }
    // as integer
    if (!dm.asArray && dm.type === 'integer') {
      value = parseInt(value)
    }
    // console.log('utils > helpers > remapItem >  value :', value)

    // set in data body
    data = setProperty(data, dm.dataField, value)
    // console.log('utils > helpers > remapItem >  data :', data)

  })
  return data
}