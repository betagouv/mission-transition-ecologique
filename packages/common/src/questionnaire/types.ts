export enum YesNo {
  Yes = 'oui',
  No = 'non',
  Unknown = 'unknown'
}

export enum QuestionnaireRoute {
  NoSpecificGoal = 'no_specific_goal',
  SpecificGoal = 'specific_goal'
}

export enum BuildingProperty {
  Owns = 'owns',
  Rents = 'rents',
  OwnsAndRents = 'owns_and_rents'
}

export enum SiretValue {
  Wildcard = 'wildcard'
}

export enum StructureSize {
  TPE = 'TPE',
  PE = 'PE',
  ME = 'ME',
  ETI_GE = 'ETI_et_GE'
}

export const SizeToWorkforce = {
  [StructureSize.TPE]: 19,
  [StructureSize.PE]: 49,
  [StructureSize.ME]: 249,
  [StructureSize.ETI_GE]: 251
}

export enum WasteSortingStatus {
  InPlace = 'in place',
  CanImprove = 'can do better',
  Unknown = 'unknown'
}

export enum WasteManagementStatus {
  Yes = 'yes',
  NoMax = 'no-max',
  No = 'no',
  Unknown = 'unknown'
}

export enum MobilityStatus {
  Yes = 'yes',
  NoMax = 'no-max',
  No = 'no',
  Unknown = 'unknown'
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
  ValidityStart = 'dispositif . début de validité',
  ValidityEnd = 'dispositif . fin de validité',
  QuestionnaireRoute = 'questionnaire . parcours',
  CurrentDate = 'date du jour',
  SectorActivity = "entreprise . secteur d'activité . est ",
  CodeNAF = 'entreprise . code NAF',
  CodeNAF1 = 'entreprise . code NAF niveau 1 . est ',
  Workforce = 'entreprise . effectif',
  BuildingOwner = 'entreprise . est propriétaire de ses locaux',
  Goal = 'questionnaire . objectif prioritaire . est'
}

export enum Entreprise {
  SectorActivity = "entreprise . secteur d'activité . est ",
  CodeNAF1 = 'entreprise . code NAF niveau 1 . est ',
  CodeNAF = 'entreprise . code NAF',
  Workforce = 'entreprise . effectif',
  BuildingOwner = 'entreprise . est propriétaire de ses locaux',
  hasObjective = 'entreprise . a un objectif ciblé',
  isTargeted = 'entreprise . est ciblée'
}

export enum PublicodeObjectives {
  EnvironmentalImpact = PublicodesKeys.Goal + ' ' + Objective.EnvironmentalImpact,
  EnergyPerformance = PublicodesKeys.Goal + ' ' + Objective.EnergyPerformance,
  WaterConsumption = PublicodesKeys.Goal + ' ' + Objective.WaterConsumption,
  BuildingRenovation = PublicodesKeys.Goal + ' ' + Objective.BuildingRenovation,
  SustainableMobility = PublicodesKeys.Goal + ' ' + Objective.SustainableMobility,
  WasteManagement = PublicodesKeys.Goal + ' ' + Objective.WasteManagement,
  EcoDesign = PublicodesKeys.Goal + ' ' + Objective.EcoDesign,
  TrainOrRecruit = PublicodesKeys.Goal + ' ' + Objective.TrainOrRecruit,
  MakeSavings = PublicodesKeys.Goal + ' ' + Objective.MakeSavings,
  DurablyInvest = PublicodesKeys.Goal + ' ' + Objective.DurablyInvest,
  UnknownYet = PublicodesKeys.Goal + ' ' + Objective.UnknownYet
}
