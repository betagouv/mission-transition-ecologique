export type DemandsAtTime = {
  year: number
  month: number
  nDemands: number
}

export interface ProgramStats {
  countProgramsTotal: number | null
  countProgramsNow: number | null
}

export interface OpportunityStats {
  countOpportunitiesTotal: number | null
  countOpportunities30Days: number | null
  demandsTimeSeries: DemandsAtTime[]
}

export default interface StatsData extends ProgramStats, OpportunityStats {}
