// CONSOLE LOG TEMPLATE
// console.log(`utils.helpers > FUNCTION_NAME > MSG_OR_VALUE :`)

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
  const res = selectors.map((selector: PropertyPath) => {
    // @ts-ignore
    const arraySelector = Array.isArray(selector)
      ? selector
      : selector
          // Add support for array notation, e.g.
          // a.b[3] becomes a.b.3.
          .replace(/\[([^[\]]*)\]/g, '.$1.')
          .split('.')
          .filter((t: any) => t !== '')

    return getFromArraySelector(from, arraySelector)
  })
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
  let val = getFrom(from, selectors)
  if (resMap.cleaning) {
    val = val.map((v) => {
      // @ts-ignore
      return cleanValue(v, resMap.cleaning, lang)
    })
  }
  return val
}

export const setIn = (obj: any, [head, ...rest]: string[], value: any) => {
  const newObj: any = Array.isArray(obj) ? [...obj] : { ...obj }
  newObj[head] = rest.length ? setIn(obj[head], rest, value) : value
  return newObj
}

export const setProperty = (obj: object, path: string, value: any) => {
  let resultObj: any

  if (path === '.') {
    resultObj = { ...obj, ...value }
  } else {
    const pathAsArray = path.split('.')
    resultObj = setIn(obj, pathAsArray, value)
  }

  return resultObj
}

export const findInObjectsArray = (objectsArray: object[], id: string, all: boolean = false) => {
  const arrayFlat: any = Object.assign({}, ...objectsArray)
  const value = all ? arrayFlat : arrayFlat[id]
  return value
}

export const groupBy = (objectsArray: object[], key: string) => {
  return objectsArray.reduce((rv: any, x: any) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
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

  const findInRef = cleaner.findInRef
  const fromField = cleaner.findFromField
  const targetField = cleaner.retrieveFromField
  const json = refs[findInRef]
  // @ts-ignore
  const obj: object = json.find((item) => item[fromField] === value)

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

export const findDefaultIfNull = (
  value: string,
  cleaner: CleanerDefaultIfNull,
  lang: string = 'fr'
) => {
  const defaultValue = cleaner.defaultValue
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
  cleaners:
    | Cleaner[]
    | CleanerReplaceAll[]
    | CleanerFromJson[]
    | CleanerFromDict[]
    | CleanerDefaultIfNull[]
    | CleanerInjectInObject[],
  lang: string = 'fr'
) => {
  let val: any = value
  cleaners.forEach((cleaner) => {
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
  let data = { ...dataStructure }
  const metaEnv = import.meta.env

  dataMapping.forEach((dm) => {
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
        value = findInObjectsArray(trackValues, dm.id)
        break
      case DataMappingFrom.AllUsedTracks:
        allResponses = findInObjectsArray(trackValues, dm.id, true)
        value = Object.keys(allResponses)
          .map((k) => {
            return `${k}: ${allResponses[k]}`
          })
          .join(' / ')
        break
      case DataMappingFrom.SelectionValues:
        value = findInObjectsArray(selectionValues, dm.id)
        break
      case DataMappingFrom.Props:
        value = props && props[dm.id]
        break
      case DataMappingFrom.PropsPath:
        value = dm.path && getFromOnePath(props, dm.path)
        break
      case DataMappingFrom.RawData:
        value = dm.path && getFromOnePath(rawData, dm.path)
        break
      default:
        break
    }

    // clean value if necessary
    if (dm.cleaning) {
      value = cleanValue(value, dm.cleaning, lang)
    }

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

    // set in data body
    data = setProperty(data, dm.dataField, value)
  })
  return data
}

// UX HELPERS
export const scrollToTop = (element: any, disableWidget: boolean, from: string | number = '') => {
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
) => {
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
