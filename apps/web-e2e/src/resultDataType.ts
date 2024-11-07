export type ResultDataType = {
  id: number,
  url: string,
  count?: number,
  values: string[]
}

export type ResultsDataType = ResultDataType[]

export type FormResultDataType = Omit<ResultDataType, 'values'> & {type: string, values:{[key:string]:{value: string|undefined|boolean, type: string} } }