export type BaseResultDataType = {
  id: number
  url: string
}

export type SearchResultDataType = BaseResultDataType & { count?: number; values: string[] }
export type SearchResultsDataType = SearchResultDataType[]

export type FormResultDataType = BaseResultDataType & {
  type: string
  manual?: boolean
  valid: boolean
  autonomousActivation?: boolean
  values: { [key: string]: { value: string | undefined | boolean; type: string } }
}
