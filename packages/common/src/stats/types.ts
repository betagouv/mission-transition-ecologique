export default interface StatsData {
  nProgramsActivated: number | null
  nOpportunitiesCreated: number | null
  nProgramsProposed: number | null
  demandsTimeSeries: {
    year: string
    month: string
    nDemands: number
  }[]
}
