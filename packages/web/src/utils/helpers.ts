// @ts-ignore
import nafCodesJson from '@tee/web/public/data/references/naf_codes_flat.json'
import comCodesJson from '@tee/web/public/data/references/com_codes.json'

import type {
  Cleaner,
  CleanerDefaultIfNull,
  CleanerFromDict,
  CleanerFromJson,
  CleanerInjectInObject,
  CleanerReplaceAll,
  FormCallbackDataMapping,
  NextTrackRule,
  PropertyPath,
  Refs,
  ResultsMapping
} from '@/types'
import { CleanerOperations, DataMappingFrom } from '@/types'

// enum NafCodeFields {
//   tags = 'tags',
//   NIV5 = 'NIV5',
//   NIV4 = 'NIV4',
//   NIV3 = 'NIV3',
//   NIV2 = 'NIV2',
//   NIV1 = 'NIV1',
//   label_vf = 'label_vf',
// }

const refs: Refs = {
  NafCodes: nafCodesJson,
  ComCodes: comCodesJson
}

// GENERIC HELPERS

export const randomChoice = (array: any[]) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export const getFrom = (from: any, selectors: PropertyPath[]) => {
  // console.log('utils > helpers > getFrom >  selectors :', selectors)
  const res = selectors.map((selector: PropertyPath) => {
    const arraySelector = Array.isArray(selector)
      ? selector
      : selector
          // Add support for array notation, e.g.
          // a.b[3] becomes a.b.3.
          .replace(/\[([^[\]]*)\]/g, '.$1.')
          .split('.')
          .filter((t: any) => t !== '')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getFromArraySelector(from, arraySelector)
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res
}

const getFromArraySelector = (from: any, selector: string[]) => {
  return selector.reduce((prev: any, cur: any) => {
    return prev && prev[cur]
  }, from)
}

export const getFromOnePath = (from: any, selector: string) => {
  const val = getFrom(from, [selector])
  return val[0]
}

export const getFromResp = (from: any, resMap: ResultsMapping, lang: string = 'fr') => {
  const selectors = resMap.respFields
  // console.log('utils > helpers > getFromResp >  selectors :', selectors)
  let val = getFrom(from, selectors)
  if (resMap.cleaning) {
    // console.log('utils > helpers > getFromResp >  selectors :', selectors)
    val = val.map((v) => {
      // @ts-ignore
      return cleanValue(v, resMap.cleaning, lang)
    })
  }
  return val
}

export const setIn = (obj: any, [head, ...rest]: string[], value: any) => {
  // console.log('utils > helpers > setIn >  obj :', obj)
  const newObj: any = Array.isArray(obj) ? [...obj] : { ...obj }
  newObj[head] = rest.length ? setIn(obj[head], rest, value) : value
  return newObj
}

export const setProperty = (obj: object, path: string, value: any) => {
  // console.log('utils > helpers > setProperty >  obj :', obj)
  // const [head, ...rest] = path.split('.')
  let resultObj: any

  if (path === '.') {
    resultObj = { ...obj, ...value }
  } else {
    const pathAsArray = path.split('.')
    resultObj = setIn(obj, pathAsArray, value)
  }

  return resultObj
}

// export const findInTracksArray = (tracksArray: object[], id: string) => {
//   console.log()
//   console.log('utils > helpers > findInTracksArray >  tracksArray :', tracksArray)
//   console.log('utils > helpers > findInTracksArray >  id :', id)

//   // let value = undefined

//   let UsedTracksFlat: any = {}
//   tracksArray.map( item => {
//     UsedTracksFlat = {...UsedTracksFlat, ...item}
//   })
//   console.log('utils > helpers > findInTracksArray >  UsedTracksFlat :', UsedTracksFlat)

//   const value = UsedTracksFlat[id]
//   console.log('utils > helpers > findInTracksArray >  value :', value)
//   return value
// }

export const findInObjectsArray = (objectsArray: object[], id: string, all: boolean = false) => {
  // console.log()
  // console.log('utils > helpers > findInObjectsArray >  objectsArray :', objectsArray)
  // console.log('utils > helpers > findInObjectsArray >  id :', id)

  // let value = undefined

  const arrayFlat: any = Object.assign({}, ...objectsArray)
  // console.log('utils > helpers > findInObjectsArray >  arrayFlat :', arrayFlat)

  const value = all ? arrayFlat : arrayFlat[id]
  // console.log('utils > helpers > findInObjectsArray >  value :', {id, value})
  return value
}

export const groupBy = <T>(objectsArray: T[], key: keyof T): Record<string, T[]> => {
  return objectsArray.reduce((rv: Record<string, T[]>, x: T) => {
    const keyValue = x[key] as unknown as string
    ;(rv[keyValue] = rv[keyValue] || []).push(x)
    return rv
  }, {})
}

// HELPERS FOR CLEANING AND REMAP

export const replaceAll = (value: any, cleaner: CleanerReplaceAll) => {
  const re = new RegExp(cleaner.stringToReplace, 'g')
  return String(value).replace(re, cleaner.replaceBy)
}

export const findFromRefs = (value: string, cleaner: CleanerFromJson) => {
  let val = value
  // console.log('utils > helpers > findFromRefs >  cleaner :', cleaner)

  const findInRef = cleaner.findInRef
  const fromField = cleaner.findFromField
  const targetField = cleaner.retrieveFromField
  const json = refs[findInRef]
  // @ts-ignore
  const obj: object = json.find((item) => item[fromField] === value)

  // console.log('utils > helpers > findFromRefs >  json :', json)
  // console.log('utils > helpers > findFromRefs >  obj :', obj)

  // @ts-ignore
  val = obj && obj[targetField]

  return val
}

export const findFromDict = (value: string | string[], cleaner: CleanerFromDict) => {
  const dict = cleaner.dict
  let valueOut: any
  if (Array.isArray(value)) {
    valueOut = value.map((v) => dict[v] || v)
  } else {
    valueOut = dict[value] || value
  }
  return valueOut
}

export const findDefaultIfNull = (value: string, cleaner: CleanerDefaultIfNull, lang: string = 'fr') => {
  // console.log()
  // console.log('utils > helpers > findDefaultIfNull > value :', value)
  // const respFields = cleaner.respFields
  const defaultValue = cleaner.defaultValue
  // console.log('utils > helpers > findDefaultIfNull > respFields :', respFields)
  // console.log('utils > helpers > findDefaultIfNull > defaultValue :', defaultValue)

  return value || defaultValue[lang]
}

export const injectInObject = (value: object | object[], cleaner: CleanerInjectInObject) => {
  const targetObject = cleaner.object || {}
  let valueOut: object = { ...targetObject }
  if (Array.isArray(value)) {
    value.forEach((v) => {
      valueOut = { ...valueOut, ...v }
    })
  } else {
    valueOut = { ...valueOut, ...value }
  }
  return valueOut
}

export const cleanValue = (
  value: any,
  cleaners: Cleaner[] | CleanerReplaceAll[] | CleanerFromJson[] | CleanerFromDict[] | CleanerDefaultIfNull[] | CleanerInjectInObject[],
  lang: string = 'fr'
) => {
  // console.log('utils > helpers > cleanValue > value :', value)
  let val: any = value
  cleaners.forEach((cleaner) => {
    // console.log('utils > helpers > cleanValue > cleaner :', cleaner)
    switch (cleaner.operation) {
      case CleanerOperations.replaceAll:
        val = replaceAll(val, <CleanerReplaceAll>cleaner)
        break
      case CleanerOperations.stringToDate:
        val = new Date(val).toLocaleDateString(lang)
        break
      case CleanerOperations.findFromRefs:
        val = findFromRefs(val, <CleanerFromJson>cleaner)
        break
      case CleanerOperations.findFromDict:
        val = findFromDict(val, <CleanerFromDict>cleaner)
        break
      case CleanerOperations.defaultIfNull:
        val = findDefaultIfNull(val, <CleanerDefaultIfNull>cleaner, lang)
        break
      case CleanerOperations.injectInObject:
        val = injectInObject(val, <CleanerInjectInObject>cleaner)
        break
      default:
        break
    }
  })
  // console.log('utils > helpers > cleanValue > val :', val)
  return val
}

export const remapItem = (
  dataStructure: object,
  dataMapping: FormCallbackDataMapping[] | NextTrackRule[],
  formData: object | any = {},
  trackValues: any[] = [],
  props: object | any = undefined,
  rawData: object | any = undefined,
  selectionValues: any[] = [],
  lang: string = 'fr'
) => {
  // console.log()
  // console.log('utils > helpers > remapItem >  dataStructure :', dataStructure)
  let data = { ...dataStructure }
  const metaEnv = import.meta.env
  // console.log('utils > helpers > remapItem >  metaEnv :', metaEnv)

  dataMapping.forEach((dm) => {
    // console.log()
    // console.log('utils > helpers > remapItem >  dm :', dm)
    let value: any = ''
    let allResponses: any
    switch (dm.from) {
      case DataMappingFrom.Env:
        value = metaEnv[dm.id]
        break
      case DataMappingFrom.FormData:
        value = formData && formData[dm.id]
        break
      case DataMappingFrom.UsedTracks:
        // console.log('utils > helpers > remapItem >  trackValues :', trackValues)
        value = findInObjectsArray(trackValues, dm.id)
        break
      case DataMappingFrom.AllUsedTracks:
        // console.log('utils > helpers > remapItem >  trackValues :', trackValues)
        allResponses = findInObjectsArray(trackValues, dm.id, true)
        // console.log('utils > helpers > remapItem >  allResponses :', allResponses)
        value = Object.keys(allResponses)
          .map((k) => {
            return `${k}: ${allResponses[k]}`
          })
          .join(' / ')
        break
      case DataMappingFrom.SelectionValues:
        // console.log('utils > helpers > remapItem >  trackValues :', trackValues)
        value = findInObjectsArray(selectionValues, dm.id)
        break
      case DataMappingFrom.Props:
        value = props && props[dm.id]
        break
      case DataMappingFrom.PropsPath:
        // console.log('utils > helpers > remapItem >  rawData :', rawData)
        value = dm.path && getFromOnePath(props, dm.path)
        break
      case DataMappingFrom.RawData:
        // console.log('utils > helpers > remapItem >  rawData :', rawData)
        value = dm.path && getFromOnePath(rawData, dm.path)
        break
      default:
        break
    }

    // clean value if necessary
    if (dm.cleaning) {
      value = cleanValue(value, dm.cleaning, lang)
    }
    // console.log('utils > helpers > remapItem >  value :', value)

    // parse as array
    if (dm.asArray) {
      value = value.split(dm.sep || ',')
      if (dm.type === 'integer') {
        value = value.map((v: string) => parseInt(v))
      }
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

// UX HELPERS
export const scrollToTop = (element: any, disableWidget: boolean, from: string | number = '') => {
  // console.log()
  // console.log('utils > helpers > scrollToTop > from :', from)
  // console.log('utils > helpers > scrollToTop > disableWidget :', disableWidget)
  // console.log('utils > helpers > scrollToTop > element :', element)
  if (disableWidget) {
    element.scrollIntoView()
  } else {
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
}

export const scrollToId = (
  elementId: string
  // targetYPosition?: number
) => {
  // console.log('\nutils > helpers > scrollToId > elementId :', elementId)
  // console.log('utils > helpers > scrollToId > targetYPosition :', targetYPosition)
  // console.log('utils > helpers > scrollToId > element :', element)
  setTimeout(() => {
    const element = document.getElementById(elementId)
    element?.scrollIntoView()
  }, 100)
}

// TEXT HELPERS

export const consolidateAmounts = (str: string | undefined) => {
  const regex = /(\d+)\s*([a-zA-Z])?/g
  return str?.replace(regex, '$1\u00a0$2')
}
