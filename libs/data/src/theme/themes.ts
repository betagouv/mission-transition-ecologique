export enum ThemeType {
  Energy = 'energy',
  Environmental = 'environmental',
  Mobility = 'mobility',
  Building = 'building',
  Water = 'water',
  Waste = 'waste',
  EcoDesign = 'eco-design',
  RH = 'rh'
}

export interface Theme {
  id: number
  Nom: string
  'Nom (Tech)': ThemeType
}
