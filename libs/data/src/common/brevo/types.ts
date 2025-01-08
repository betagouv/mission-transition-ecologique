export enum DealStage {
  Nouvelle = 'f0f8a5c8-023b-46cc-9826-1c5da7abc1f0',
  Transmise = '659d15cff01695.94588187',
  Perdue = 'c1d2ed92-8bc3-492d-a3ec-0284e214baa0',
  AideProposee = '659d15cff06be7.98275409',
  Gagnee = '1e33531f-0eef-40ea-b97c-35aadc929446'
}

export type BrevoDeal = {
  creationDate: string
  status: DealStage
}

export type RawBrevoDealAttributes = {
  created_at: string
  deal_stage: string
}
