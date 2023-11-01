import type { Translations } from './translationTypes'
import type { FormOptions, FormCallbackDataMapping } from './formTypes'

// FOR TRACKS

enum ConditionOperators {
  or = 'or',
  and = 'and',
  is = '==',
  exist = 'exists',
  inexist = 'inexists',
  notEqual = '!=',
  superior = '>',
  superiorOrEqual = '>=',
  inferior = '<',
  inferiorOrEqual = '<=',
}
export interface ConditionTrack {
  type?: string,
  operator?: ConditionOperators,
  value?: any | any[],
}

enum TrackCalloutType {
  info = 'info'
}
export interface TrackCallout {
  header?: Translations,
  headerStyle?: string,
  title: Translations,
  bigTitle: boolean,
  description: Translations,
  bgColor?: string,
  type?: TrackCalloutType
  imageLeft?: string,
  imageRight?: string,
  hintIcon?: string,
  hint?: Translations,
}

enum TrackComponents {
  cards = 'cards',
  buttons = 'buttons',
  simpleButtons = 'simpleButtons'
}
export interface TrackInterface {
  component: TrackComponents,
  columnWidth?: number | string,
}
enum TrackBehaviorOperators {
  or = 'or'
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
  type: string
}

export interface NextTrackRule extends FormCallbackDataMapping {
  conditions: ConditionTrack[]
}
export interface NextTrackRule {
  help?: string,
  rules: NextTrackRule[],
  next: TrackNext
}
export interface TrackNext {
  default: string,
  exceptions? : object[]
  [name: string]: any
}

enum HasInputOptions {
  number = 'number',
  date = 'date',
  text = 'text'
}
export interface TrackOptions {
  id?: string,
  disabled?: Boolean,
  value: string | number | object,
  required?: Boolean,
  title: Translations,
  label: Translations,
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
  intro?: Translations,
  fields?: TrackOptionsField,
  next?: TrackNext
}

export interface InputCleaningRule {
  operator?: ConditionOperators,
  conditionValue?: string | number,
  valueField?: string,
  value?: any | any[],
}
export interface TrackOptionsInput extends TrackOptions {
  placeholder: Translations,
  defaultInput?: string | number,
  inputField?: string,
  inputMax: number,
  inputMin: number,
  inputCleaning: InputCleaningRule[],
  callbacks? : any,
  wildcard?: any
}

export interface Track {
  id: string,
  help?: string,
  category?: string,
  bgColor?: string,
  imageRight?: string,
  title: Translations,
  label: Translations,
  interface?: TrackInterface,
  behavior?: TrackBehavior,
  // config?: TrackResultsConfig,
  next?: TrackNext,
  options?: TrackOptions,
  form?: FormOptions,
}

export interface TracksList {
  programs: Track[]
}

export interface UsedTrack {
  id: string | any,
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

export interface TrackFilterValue {
  label: string,
  value: string
}

export interface TrackFilter {
  field: string,
  label: string,
  trueIf: ConditionOperators,
  values: TrackFilterValue[]
}
export interface TrackResultsConfig {
  noResultsMessage: Translations,
  noResultsImage: string,
  showAlertNoResults: boolean,
  showAlertResults: boolean,
  showResultsTitle: boolean,
  showProgramInfos: boolean,
  showProgramSubtitles: boolean,
  filters?: TrackFilter[]
}