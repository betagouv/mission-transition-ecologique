export type DemandsTimeSeries = {
  year: YYYY
  month: MM
  nDemands: number
}[]

export interface Statistics {
  nProgramsActivated: number | null
  nOpportunitiesCreated: number | null
  nProgramsProposed: number | null
  demandsTimeSeries: DemandsTimeSeries | null
}

type MM =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'

// Beware of the bug of the year 2030
type YYYY = '2023' | '2024' | '2025' | '2026' | '2027' | '2028' | '2029'
