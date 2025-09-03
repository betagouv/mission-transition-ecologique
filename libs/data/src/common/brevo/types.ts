export enum DealStage {
  Nouvelle = 'Nouvelle',
  Transmise = 'Transmise',
  Perdue = 'Perdue',
  AideProposee = 'AideProposee',
  Gagnee = 'Gagnee'
}

export const DealStageIdToStage: Record<string, DealStage> = {
  'f0f8a5c8-023b-46cc-9826-1c5da7abc1f0': DealStage.Nouvelle,
  '659d15cff01695.94588187': DealStage.Transmise,
  'c1d2ed92-8bc3-492d-a3ec-0284e214baa0': DealStage.Perdue,
  '659d15cff06be7.98275409': DealStage.AideProposee,
  '1e33531f-0eef-40ea-b97c-35aadc929446': DealStage.Gagnee
}

export type BrevoDeal = {
  creationDate: string
  status: DealStage
  dealId: string
}

export type RawBrevoDealAttributes = {
  created_at: string
  deal_stage: string
}

export enum MailType {
  Initial = 'Initial',
  EndOfLife = 'EndOfLife',
  Periodic = 'Periodic'
}
