export default interface StatsData {
  nProgramsTotal: number | null
  nProgramsNow: number | null
  nOpportunitiesTotal: number | null
  nOpportunities30Days: number | null
  demandsTimeSeries: {
    year: string
    month: string
    nDemands: number
  }[]
}
