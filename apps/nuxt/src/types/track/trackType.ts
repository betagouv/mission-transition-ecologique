import {
  Translations,
  FormCallback,
  FormCallbackDataMapping,
  FormOptions,
  PropertyPath,
  TrackId,
  FieldType,
  QuestionnaireData,
  ThemeId,
  Color
} from '@/types'
import { ConditionOperators } from '@/types/conditionOperators'

// FOR TRACKS
type ConditionIs = {
  type: string
  operator: ConditionOperators.is
  value: string | number | object
}

type ConditionExistsOrIsMissing = {
  type: string
  operator: ConditionOperators.exists | ConditionOperators.isMissing
}

export type Condition = ConditionIs | ConditionExistsOrIsMissing

export enum TrackCalloutType {
  info = 'info'
}

export interface TrackCallout {
  header?: Translations
  title: Translations
  titleStyle?: string
  bigTitle: boolean
  description?: Translations
  descriptionStyle?: string
  bgColor?: Color
  type?: TrackCalloutType
  imageLeft?: string
  imageRight?: string
  hintIcon?: string
  hint?: Translations
}

export enum TrackComponent {
  Cards = 'cards',
  Themes = 'themes',
  Buttons = 'buttons',
  SimpleButtons = 'simpleButtons',
  Form = 'form',
  Input = 'input',
  Siret = 'siret',
  Activity = 'activity',
  CitySearch = 'citySearch',
  Select = 'select',
  Results = 'results'
}
export interface TrackInterface {
  component: TrackComponent
  columnWidth?: number | string
}
export interface TrackBehavior {
  multipleChoices?: boolean
}
export interface TrackOptionsField {
  id: string
  label: Translations
  hint?: Translations
  required?: boolean
  type: FieldType
}

export interface TrackNext {
  default: TrackId | false
  ruleSet?: NextTrackRuleSet[]
  [name: string]: any
}

export interface NextTrackRuleSet {
  help?: string
  rules: NextTrackRule[]
  next: TrackNext
}

export interface NextTrackRule extends FormCallbackDataMapping {
  conditions: Condition[]
}

export enum HasInputOptions {
  Number = FieldType.Number,
  Date = FieldType.Date,
  Text = FieldType.Text,
  Search = FieldType.Search
}

export interface TrackOptions {
  id?: string
  disabled?: boolean
  value?: string | number | object | Record<string, string | number>
  validation?: CallableFunction
  questionnaireData?: QuestionnaireData
  required?: boolean
  title?: Translations
  label?: Translations
  shortLabel?: Translations
  hintLabel?: Translations
  resume?: Translations
  hint?: Translations
  hintImageIcon?: string
  hintIcon?: string
  hintImage?: Translations
  imageTop?: string
  hasInput?: HasInputOptions
  callout?: TrackCallout
  info?: Translations
  placeholder?: Translations
  postResponses?: Translations
  callbacks?: FormCallback[]
  intro?: Translations
  fields?: TrackOptionsField[]
  next?: TrackNext
}

export interface InputCleaningRule {
  operator?: ConditionOperators
  conditionValue?: string | number
  valueField?: string
  value?: any
}

export interface TrackOptionsInput extends TrackOptions {
  hasInput: HasInputOptions
  defaultInput?: string | number
  inputField?: string
  inputMax?: number
  inputMin?: number
  inputCleaning?: InputCleaningRule[]
  wildcard?: TrackOptionWildcard
}

interface TrackOptionWildcard {
  label: Translations
  value?: string | number
  next: TrackNext
}

export interface TrackOptionsSelect extends TrackOptions {
  label: Translations
}

// Alias for TrackOptions (TrackOptions | TrackOptionsSelect | TrackOptionsInput)
export type TrackOptionsUnion = TrackOptions | TrackOptionsSelect | TrackOptionsInput

export type TrackOptionItem = {
  option: TrackOptionsUnion
  index?: number
  remove?: boolean
  forceKeep?: boolean
}

export interface Track {
  id: TrackId
  help?: string
  category?: TrackCategory
  imageRight?: string
  title: Translations
  label?: Translations
  info?: Translations
  hint?: Translations
  resume?: Translations
  callout?: TrackCallout
  theme?: ThemeId
  interface?: TrackInterface
  behavior?: TrackBehavior
  config?: TrackResultsConfig
  next?: TrackNext
  options?: TrackOptionsUnion[]
  form?: FormOptions
}

export interface UsedTrack {
  id: TrackId
  component: TrackComponent
  category?: TrackCategory
  final?: boolean
  completed: boolean
  step: number
  selected: TrackOptionsUnion[]
  next?: TrackNext
}

export enum TrackCategory {
  MyEntreprise = 'myEntreprise',
  OurHelp = 'ourHelp',
  MyEnergy = 'myEnergy',
  MyBuildings = 'myBuildings',
  MyTransport = 'myTransport',
  MyWastes = 'myWastes',
  MyWater = 'myWater',
  MyStrategy = 'myStrategy',
  MyMobility = 'myMobility',
  MyProject = 'myProject'
}

// FOR TRACK RESULTS

export interface TrackFilterValue {
  label: string
  value: string
}

export interface TrackFilter {
  field: PropertyPath
  label: string
  trueIf: ConditionOperators
  values: TrackFilterValue[]
}
export interface TrackResultsConfig {
  noResultsMessage: Translations
  noResultsImage: string
  showResultsTitle: boolean
  showProgramInfos: boolean
  showProgramSubtitles: boolean
  filters?: TrackFilter[]
}

export const isTrackOptionsInput = (option: TrackOptionsInput | TrackOptions): option is TrackOptionsInput => {
  return 'hasInput' in option
}

export interface UsedTrackValuePair {
  currentId: string
  completed: boolean
  selection: (string | number | object | undefined)[]
}
