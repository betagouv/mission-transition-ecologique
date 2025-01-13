export enum YesNo {
  Yes = 'oui',
  No = 'non',
  Unknown = 'je-ne-sais-pas'
}

export enum QuestionnaireRoute {
  NoSpecificGoal = 'je-ne-sais-pas-par-ou-commencer',
  SpecificGoal = 'j-ai-un-projet'
}

export enum BuildingProperty {
  Owns = 'proprietaire',
  Rents = 'locataire',
  OwnsAndRents = 'proprietaire-et-locataire',
  No = 'non'
}

export enum SiretValue {
  Wildcard = 'siret-non-renseigne'
}

export enum StructureSize {
  EI = 'EI',
  MICRO = 'MICRO',
  TPE = 'TPE',
  PE = 'PE',
  ME = 'ME',
  ETI = 'ETI',
  GE = 'GE'
}

export const SizeToWorkforce: { [key in StructureSize]: number } = {
  [StructureSize.EI]: 1,
  [StructureSize.MICRO]: 5,
  [StructureSize.TPE]: 15,
  [StructureSize.PE]: 40,
  [StructureSize.ME]: 150,
  [StructureSize.ETI]: 350,
  [StructureSize.GE]: 600
}

export const SizeToText: { [key in StructureSize]: string } = {
  [StructureSize.EI]: 'Micro-entrepreneur',
  [StructureSize.MICRO]: 'Moins de 10 employés',
  [StructureSize.TPE]: 'Entre 10 et 19 employés',
  [StructureSize.PE]: 'Entre 20 et 49 employés',
  [StructureSize.ME]: 'Entre 50 et 249 employés',
  [StructureSize.ETI]: 'Entre 250 et 499 employés',
  [StructureSize.GE]: 'Plus de 500 employés'
}

export enum LegalCategory {
  EI = '1000'
}

export enum WasteSortingStatus {
  InPlace = 'en-place',
  CanImprove = 'peut-mieux-faire',
  Unknown = 'je-ne-sais-pas'
}

export enum WasteManagementStatus {
  Yes = 'oui',
  No = 'non',
  Unknown = 'je-ne-sais-pas',
  NoMax = 'non-max'
}

export enum MobilityStatus {
  Yes = 'oui',
  No = 'non',
  Unknown = 'je-ne-sais-pas',
  NoMax = 'non-max'
}

export enum Sector {
  Craftsmanship = 'artisanat',
  Industry = 'industrie',
  Tourism = 'tourisme',
  Tertiary = 'tertiaire',
  Agriculture = 'agriculture',
  Other = 'autre secteur'
}

export enum Objective {
  EnvironmentalImpact = 'mon impact environnemental',
  EnergyPerformance = 'ma performance énergétique',
  WaterConsumption = "diminuer ma consommation d'eau",
  BuildingRenovation = 'rénover mon bâtiment',
  SustainableMobility = 'la mobilité durable',
  WasteManagement = 'la gestion des déchets',
  EcoDesign = "l'écoconception",
  TrainOrRecruit = 'former ou recruter',
  MakeSavings = 'faire des économies',
  DurablyInvest = 'investir durable',
  Biodiversity = 'préserver la biodiversité',
  UnknownYet = 'je ne sais pas encore'
}

export const Objectives = {
  [Objective.EnvironmentalImpact]: YesNo.No,
  [Objective.EnergyPerformance]: YesNo.No,
  [Objective.WaterConsumption]: YesNo.No,
  [Objective.BuildingRenovation]: YesNo.No,
  [Objective.SustainableMobility]: YesNo.No,
  [Objective.WasteManagement]: YesNo.No,
  [Objective.EcoDesign]: YesNo.No,
  [Objective.TrainOrRecruit]: YesNo.No,
  [Objective.MakeSavings]: YesNo.No,
  [Objective.DurablyInvest]: YesNo.No,
  [Objective.UnknownYet]: YesNo.No
}

export enum PublicodesKeys {
  CodeNAF = 'entreprise . code NAF',
  ValidityStart = 'dispositif . début de validité',
  ValidityEnd = 'dispositif . fin de validité',
  QuestionnaireRoute = 'questionnaire . parcours',
  CurrentDate = 'date du jour',
  Workforce = 'entreprise . effectif',
  BuildingOwner = 'entreprise . est propriétaire de ses locaux',
  isMicroEntrepreneur = 'entreprise . microentrepreneur',
  hasObjective = 'entreprise . a un objectif ciblé',
  isTargeted = 'entreprise . est ciblée',
  CodeNAF1 = 'entreprise . code NAF niveau 1 . est ',
  Goal = 'questionnaire . objectif prioritaire . est ',
  SectorActivity = "entreprise . secteur d'activité . est "
}

export enum FiltersKeys {
  Theme = 'theme'
}

export enum PublicodeObjective {
  EnvironmentalImpact = PublicodesKeys.Goal + Objective.EnvironmentalImpact,
  EnergyPerformance = PublicodesKeys.Goal + Objective.EnergyPerformance,
  WaterConsumption = PublicodesKeys.Goal + Objective.WaterConsumption,
  BuildingRenovation = PublicodesKeys.Goal + Objective.BuildingRenovation,
  SustainableMobility = PublicodesKeys.Goal + Objective.SustainableMobility,
  WasteManagement = PublicodesKeys.Goal + Objective.WasteManagement,
  EcoDesign = PublicodesKeys.Goal + Objective.EcoDesign,
  TrainOrRecruit = PublicodesKeys.Goal + Objective.TrainOrRecruit,
  MakeSavings = PublicodesKeys.Goal + Objective.MakeSavings,
  DurablyInvest = PublicodesKeys.Goal + Objective.DurablyInvest,
  Biodiversity = PublicodesKeys.Goal + Objective.Biodiversity,
  UnknownYet = PublicodesKeys.Goal + Objective.UnknownYet
}
