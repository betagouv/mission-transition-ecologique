export default interface StatsData {
  nProgramsTotal: number | null
  nProgramsNow: number | null
  nOpportunitiesTotal: number | null
  nOpportunities30Days: number | null
  demandsTimeSeries: DemandsAtTime[]
}

export type DemandsAtTime = {
  year: number
  month: number
  nDemands: number
}
