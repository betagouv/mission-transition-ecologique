import type { Translations } from './translationTypes'
import type { FormOptions, FormCallbackDataMapping, FormCallback } from './formTypes'
import { ConditionOperators } from '@/types/conditionOperators'

// FOR TRACKS
export interface ConditionTrack {
  type?: string,
  operator?: ConditionOperators,
  value?: any | any[],
}

export enum TrackCalloutType {
  info = 'info'
}

export interface TrackCallout {
  header?: Translations,
  headerStyle?: string,
  title: Translations,
  titleStyle?: string,
  bigTitle: boolean,
  description?: Translations,
  descriptionStyle?: string,
  bgColor?: string,
  type?: TrackCalloutType
  imageLeft?: string,
  imageRight?: string,
  hintIcon?: string,
  hint?: Translations,
}

export enum TrackComponents {
  Cards = 'cards',
  Buttons = 'buttons',
  SimpleButtons = 'simpleButtons',
  Form = 'Form',
  Input = 'input',
  Results = 'results',
}
export interface TrackInterface {
  component: TrackComponents,
  columnWidth?: number | string,
}
export enum TrackBehaviorOperators {
  or = ConditionOperators.or
}
export interface TrackBehavior {
  multipleChoices?: boolean,
  singleChoice?: boolean,
  operator?: TrackBehaviorOperators,
}
export interface TrackOptionsField {
  id: string,
  label: Translations,
  hint?: Translations,
  required?: boolean,
  type: TrackFieldType,
}

export enum TrackFieldType {
  Text = 'text',
  Number = 'number',
  Select = 'select',
  Radio = 'radio',
  Checkbox = 'checkbox',
  Textarea = 'textarea',
  Email = 'email',
  Tel = 'tel',
  Date = 'date',
  Search = 'search',
}

export interface NextTrackRule extends FormCallbackDataMapping {
  conditions: ConditionTrack[]
}

export interface NextTrackRules {
  help?: string,
  rules: NextTrackRule[],
  next: TrackNext
}

export interface TrackNext {
  default: TrackId | false,
  exceptions? : NextTrackRules[]
  [name: string]: any
}

export enum HasInputOptions {
  Number = TrackFieldType.Number,
  Date = TrackFieldType.Date,
  Text = TrackFieldType.Text,
  Search = TrackFieldType.Search,
}

export interface TrackOptions {
  id?: string,
  disabled?: boolean,
  value: string | number | object,
  required?: boolean,
  title?: Translations,
  label?: Translations,
  resume?: Translations,
  hint?: Translations,
  hintImageIcon?: string,
  hintIcon?: string,
  hintImage?: Translations,
  imageTop?: string,
  hasInput?: HasInputOptions,
  callout?: TrackCallout,
  info?: Translations,
  placeholder?: Translations,
  postResponses?: Translations,
  callbacks?: FormCallback[],
  intro?: Translations,
  fields?: TrackOptionsField[],
  next?: TrackNext
}

export interface InputCleaningRule {
  operator?: ConditionOperators,
  conditionValue?: string | number,
  valueField?: string,
  value?: any | any[],
}

export interface TrackOptionsInput extends TrackOptions {
  hasInput: HasInputOptions,
  defaultInput?: string | number,
  inputField?: string,
  inputMax?: number,
  inputMin?: number,
  inputCleaning?: InputCleaningRule[],
  wildcard?: TrackOptionWildcard
}

interface TrackOptionWildcard {
  label: Translations,
  next: TrackNext
}

export interface Track {
  id: TrackId,
  help?: string,
  category?: string,
  bgColor?: string,
  imageRight?: string,
  title: Translations,
  label: Translations,
  info?: Translations,
  hint?: Translations,
  resume?: Translations,
  callout?: TrackCallout,
  interface?: TrackInterface,
  behavior?: TrackBehavior,
  config?: TrackResultsConfig,
  next?: TrackNext,
  options?: (TrackOptions | TrackOptionsInput)[],
  form?: FormOptions,
}

export interface TracksList {
  programs: Track[]
}

export interface UsedTrack {
  id: string | any,
  component: TrackComponents | string,
  category?: string,
  final?: boolean,
  completed: boolean,
  // updating: boolean,
  step: number,
  // values: any[] | null,
  // titles?: Translations[],
  // val: any[] | null,
  // data: object,
  selected: TrackOptions[],
  next: any
}

// FOR TRACKS - COMPONENTS

export interface TrackOpt {
  value: string,
  [name: string]: any
}

export interface TrackChoice {
  id: string | number,
  step: number,
  values: string[] | object[],
  // val: object[],
  data?: object | object[]
}

// FOR TRACK RESULTS

export interface TrackResultsConfig {
  showAlertNoResults: boolean,
  showAlertResults: boolean,
  showResultsTitle: boolean,
  showProgramInfos: boolean,
  showProgramSubtitles: boolean
}


export enum TrackId {
  BuildingProperty = 'track_structure_building_property',
  BuildingSurface = 'track_structure_building_surface',
  ContactForm = 'track_form',
  EnergyReductionPriority = 'track_energy_reduction_priority',
  EnergyTypes = 'track_energy_types',
  Goals = 'track_goals',
  Help = 'track_help',
  Mobility = 'track_mobility',
  MobilityEnergy = 'track_mobility_energy',
  MobilityNumberVehicles = 'track_mobility_number_vehicles',
  Needs = 'track_needs',
  Results = 'track_results',
  Roles = 'track_roles',
  Sectors = 'track_sectors',
  Siret = 'track_siret',
  Status = 'track_status',
  StrategyAudits = 'track_strategy_audits',
  StrategyAuditsSelect = 'track_strategy_audits_select',
  StructureSizes = 'track_structure_sizes',
  StructureWorkforce = 'track_structure_workforce',
  WastesMaterials = 'track_wastes_materials',
  WastesSorting = 'track_wastes_sorting',
  WastesStake = 'track_wastes_stake',
  WaterStake = 'track_water_stake',
}

export const isTrackOptionsInput = (option: TrackOptionsInput | TrackOptions): option is TrackOptionsInput => {
  return 'hasInput' in option
}
