// CONSOLE LOG TEMPLATE
// console.log(`utils.helpers > FUNCTION_NAME > MSG_OR_VALUE :`)
import {
  Cleaner,
  CleanerDefaultIfNull,
  CleanerFromDict,
  CleanerInjectInObject,
  CleanerOperations,
  CleanerReplaceAll,
  DataMappingFrom,
  FormCallbackDataMapping,
  NextTrackRule,
  PropertyPath,
  ReqResp,
  ResultsMapping
} from '@/types'
import { CompanyDataStorage } from '@/tools/companyData'
import { CompanyDataStorageKey } from '@/tools/companyData/types/companyDataType'

// GENERIC HELPERS

export const getFrom = (from: any, selectors: PropertyPath[]) => {
  const res = selectors.map((selector: PropertyPath) => {
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

export const getFromResp = (from: ReqResp, resMap: ResultsMapping, lang = 'fr') => {
  const selectors = resMap.respFields
  let values = getFrom(from, selectors)
  if (resMap.cleaning) {
    values = values.map((value) => {
      return cleanValue(value, resMap.cleaning as Cleaner[] | CleanerReplaceAll[] | CleanerDefaultIfNull[], lang)
    })
  }

  return values
}

export const setIn = (obj: any, [head, ...rest]: string[], value: any) => {
  const newObj: any = Array.isArray(obj) ? [...(obj as [])] : { ...obj }

  newObj[head] = rest.length ? setIn(obj[head], rest, value) : value

  return newObj
}

export const setProperty = (obj: object, path: string, value: any) => {
  let resultObj: object

  if (path === '.') {
    resultObj = { ...obj, ...value } as object
  } else {
    const pathAsArray = path.split('.')

    resultObj = setIn(obj, pathAsArray, value)
  }

  return resultObj
}

export const findInObjectsArray = (objectsArray: object[], id: string, all = false) => {
  const arrayFlat: Record<string, unknown> = Object.assign({}, ...objectsArray) as Record<string, unknown>
  return all ? arrayFlat : arrayFlat[id]
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

export const findDefaultIfNull = (value: string, cleaner: CleanerDefaultIfNull, lang = 'fr') => {
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
  cleaners: Cleaner[] | CleanerReplaceAll[] | CleanerFromDict[] | CleanerDefaultIfNull[] | CleanerInjectInObject[],
  lang = 'fr'
) => {
  let val: unknown = value
  cleaners.forEach((cleaner) => {
    switch (cleaner.operation) {
      case CleanerOperations.replaceAll:
        val = replaceAll(val, <CleanerReplaceAll>cleaner)
        break
      case CleanerOperations.stringToDate:
        val = new Date(val as string | number | Date).toLocaleDateString(lang)
        break
      case CleanerOperations.findFromDict:
        val = findFromDict(val as string | string[], <CleanerFromDict>cleaner)
        break
      case CleanerOperations.defaultIfNull:
        val = findDefaultIfNull(val as string, <CleanerDefaultIfNull>cleaner, lang)
        break
      case CleanerOperations.injectInObject:
        val = injectInObject(val as object | object[], <CleanerInjectInObject>cleaner)
        break
      default:
        break
    }
  })
  return val
}

export const remapItem = (
  dataStructure: object,
  dataMappings: FormCallbackDataMapping[] | NextTrackRule[],
  formData: any = {},
  trackValues: any[] = [],
  props: any = undefined,
  rawData: any = undefined,
  selectionValues: any[] = [],
  lang = 'fr'
) => {
  let data = { ...dataStructure }

  dataMappings.forEach((dataMapping) => {
    let value: unknown = ''
    let allResponses: any
    switch (dataMapping.from) {
      case DataMappingFrom.CompanyData:
        value = CompanyDataStorage.getItem(dataMapping.id as CompanyDataStorageKey)
        break
      case DataMappingFrom.FormData:
        value = formData?.[dataMapping.id]
        break
      case DataMappingFrom.UsedTracks:
        value = findInObjectsArray(trackValues as object[], dataMapping.id)
        break
      case DataMappingFrom.AllUsedTracks:
        allResponses = findInObjectsArray(trackValues as object[], dataMapping.id, true)

        value = Object.keys(allResponses)
          .map((k) => {
            return `${k}: ${allResponses[k]}`
          })
          .join(' / ')
        break
      case DataMappingFrom.SelectionValues:
        value = findInObjectsArray(selectionValues as object[], dataMapping.id)
        break
      case DataMappingFrom.Props:
        value = props?.[dataMapping.id]
        break
      case DataMappingFrom.PropsPath:
        value = dataMapping.path && getFromOnePath(props, dataMapping.path)
        break
      case DataMappingFrom.RawData:
        value = dataMapping.path && getFromOnePath(rawData, dataMapping.path)
        break
      default:
        break
    }

    // clean value if necessary
    if (dataMapping.cleaning) {
      value = cleanValue(value, dataMapping.cleaning, lang)
    }

    // parse as array
    if (dataMapping.asArray) {
      value = (value as string).split(dataMapping.sep || ',')
      if (dataMapping.type === 'integer') {
        value = (value as string[]).map((v: string) => parseInt(v))
      }
    }
    // as integer
    if (!dataMapping.asArray && dataMapping.type === 'integer' && typeof value === 'string') {
      value = parseInt(value)
    }

    // set in data body
    data = setProperty(data, dataMapping.dataField, value)
  })
  return data
}

// TEXT HELPERS

export const consolidateAmounts = (str: string | undefined) => {
  const regex = /(\d+)\s*([a-zA-Z])?/g
  return str?.replace(regex, '$1\u00a0$2')
}
