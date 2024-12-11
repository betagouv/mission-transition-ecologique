export enum ChangeFreq {
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
  Never = 'never'
}

export enum Priority {
  Highest = 1.0,
  High = 0.8,
  MidHigh = 0.6,
  Mid = 0.5,
  Low = 0.2,
  Null = 0.0
}

export interface PathSettings {
  path: string
  changeFreq: ChangeFreq
  priority: Priority
}
