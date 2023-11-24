// LEGACY
export enum YesNo {
  Yes = 'oui',
  No = 'non'
}

export enum Entreprise {
  SectorActivity = "entreprise . secteur d'activité . est ",
  CodeNAF = 'entreprise . code NAF niveau 1 . est ',
  Workforce = 'entreprise . effectif',
}

enum questionnaires {
  priorityObjectives = 'questionnaire . objectif prioritaire . est ',
}

export enum Sector {
  Craftsmanship = 'artisanat',
  Industry = 'industrie',
  Tourism = 'tourisme',
  Tertiary = 'tertiaire',
  Agriculture = 'agriculture',
  Other = 'autre secteur'
}

export enum EntrepriseSector {
  Craftsmanship = Entreprise.SectorActivity + Sector.Craftsmanship,
  Industry = Entreprise.SectorActivity + Sector.Industry,
  Tourism = Entreprise.SectorActivity + Sector.Tourism,
  Tertiary = Entreprise.SectorActivity + Sector.Tertiary,
  Agriculture = Entreprise.SectorActivity + Sector.Agriculture,
  Other = Entreprise.SectorActivity + Sector.Other
}

export const sectors = {
  [EntrepriseSector.Craftsmanship] : YesNo.No,
  [EntrepriseSector.Industry] : YesNo.No,
  [EntrepriseSector.Tourism] : YesNo.No,
  [EntrepriseSector.Tertiary] : YesNo.No,
  [EntrepriseSector.Agriculture] : YesNo.No,
  [EntrepriseSector.Other] : YesNo.No
}

// NAF CODES
// Associates a NAF1 (composed of 1 letter) to its expected publicode variable
export const NAF1ToVar = (letter: string): string => Entreprise.CodeNAF + letter

export const NAF1Letters = [...'ABCDEFGHIJKLMNOPQRSTU'] as const

// publicodes variable initialization to "non"
export const codesNAF1: { [p: string]: YesNo } = Object.fromEntries(NAF1Letters.map((l) => [NAF1ToVar(l), YesNo.No]))

export const SectorByNAF = {
  [EntrepriseSector.Craftsmanship]: ['C', 'E', 'F', 'H', 'I'],
  [EntrepriseSector.Industry]: ['B', 'C', 'D', 'E', 'F'],
  [EntrepriseSector.Tourism]: ['A', 'I'],
  [EntrepriseSector.Tertiary]: ['G','H','I','J','K','L','M','N','O','P','Q','R','S'],
  [EntrepriseSector.Agriculture]: ['A'],
  [EntrepriseSector.Other]: ['T', 'U'],
}

enum Objective {
  EnvironmentalImpact = 'mon impact environnemental',
  EnergyPerformance = 'ma performance énergétique',
  WaterConsumption = 'diminuer ma consommation d\'eau',
  BuildingRenovation = 'rénover mon bâtiment',
  SustainableMobility = 'la mobilité durable',
  WasteManagement = 'la gestion des déchets',
  EcoDesign = 'l\'écoconception',
  TrainOrRecruit = 'former ou recruter',
  MakeSavings = 'faire des économies',
  DurablyInvest = 'investir durable',
  UnknownYet = 'je ne sais pas encore',
}

export enum Objectives {
  EnvironmentalImpact = questionnaires.priorityObjectives + Objective.EnvironmentalImpact,
  EnergyPerformance = questionnaires.priorityObjectives + Objective.EnergyPerformance,
  WaterConsumption = questionnaires.priorityObjectives + Objective.WaterConsumption,
  BuildingRenovation = questionnaires.priorityObjectives + Objective.BuildingRenovation,
  SustainableMobility = questionnaires.priorityObjectives + Objective.SustainableMobility,
  WasteManagement = questionnaires.priorityObjectives + Objective.WasteManagement,
  EcoDesign = questionnaires.priorityObjectives + Objective.EcoDesign,
  TrainOrRecruit = questionnaires.priorityObjectives + Objective.TrainOrRecruit,
  MakeSavings = questionnaires.priorityObjectives + Objective.MakeSavings,
  DurablyInvest = questionnaires.priorityObjectives + Objective.DurablyInvest,
  UnknownYet = questionnaires.priorityObjectives + Objective.UnknownYet,
}

export const priorityObjectives = {
  [Objectives.EnvironmentalImpact]: YesNo.No,
  [Objectives.EnergyPerformance]: YesNo.No,
  [Objectives.WaterConsumption]: YesNo.No,
  [Objectives.BuildingRenovation]: YesNo.No,
  [Objectives.SustainableMobility]: YesNo.No,
  [Objectives.WasteManagement]: YesNo.No,
  [Objectives.EcoDesign]: YesNo.No,
  [Objectives.TrainOrRecruit]: YesNo.No,
  [Objectives.MakeSavings]: YesNo.No,
  [Objectives.DurablyInvest]: YesNo.No,
  [Objectives.UnknownYet]: YesNo.No,
}
