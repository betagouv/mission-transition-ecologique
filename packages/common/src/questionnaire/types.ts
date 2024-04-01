export enum QuestionnaireRoute {
  NoSpecificGoal = 'no_specific_goal',
  SpecificGoal = 'specific_goal'
}

export enum BuildingProperty {
  Owns = 'owns',
  Rents = 'rents',
  OwnsAndRents = 'owns_and_rents'
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

export enum WasteSorting {
  InPlace = 'in place',
  CanImprove = 'can do better',
  Unknown = 'unknown'
}

export enum WastePriority {
  Yes = 'yes',
  NoMax = 'no-max',
  No = 'no',
  Unknown = 'unknown'
}
