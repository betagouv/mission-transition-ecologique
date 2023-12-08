import type {
  Translations,
  FormCallback,
  FormCallbackDataMapping,
  FormOptions,
  PropertyPath
} from '@tee/web/src/types'
import { ConditionOperators } from '@tee/web/src/types/conditionOperators'
import type { TrackId } from '@tee/web/src/types'

// FOR TRACKS
export type ConditionTrack =
  | {
      type: string
      operator: ConditionOperators.is
      value: string | number | object
    }
  | {
      type: string
      operator: ConditionOperators.exists | ConditionOperators.isMissing
    }

export enum TrackCalloutType {
  info = 'info'
}

export interface TrackCallout {
  header?: Translations
  headerStyle?: string
  title: Translations
  titleStyle?: string
  bigTitle: boolean
  description?: Translations
  descriptionStyle?: string
  bgColor?: string
  type?: TrackCalloutType
  imageLeft?: string
  imageRight?: string
  hintIcon?: string
  hint?: Translations
}

export enum TrackComponents {
  Cards = 'cards',
  Buttons = 'buttons',
  SimpleButtons = 'simpleButtons',
  Form = 'form',
  Input = 'input',
  Select = 'select',
  Results = 'results'
}
export interface TrackInterface {
  component: TrackComponents
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
  type: TrackFieldType
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
  Search = 'search'
}

export interface NextTrackRule extends FormCallbackDataMapping {
  conditions: ConditionTrack[]
}

export interface NextTrackRuleSet {
  help?: string
  rules: NextTrackRule[]
  next: TrackNext
}

export interface TrackNext {
  default: TrackId | false
  exceptions?: NextTrackRuleSet[]
  [name: string]: any
}

export enum HasInputOptions {
  Number = TrackFieldType.Number,
  Date = TrackFieldType.Date,
  Text = TrackFieldType.Text,
  Search = TrackFieldType.Search
}

export interface TrackOptions {
  id?: string
  disabled?: boolean
  value: string | number | object
  required?: boolean
  title?: Translations
  label?: Translations
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
  value?: any | any[]
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

export interface TrackOptionsSelect extends TrackOptions {
  label: Translations
}
interface TrackOptionWildcard {
  label: Translations
  next: TrackNext
}

export interface Track {
  id: TrackId
  help?: string
  category?: string
  bgColor?: string
  imageRight?: string
  title: Translations
  label: Translations
  info?: Translations
  hint?: Translations
  resume?: Translations
  callout?: TrackCallout
  interface?: TrackInterface
  behavior?: TrackBehavior
  config?: TrackResultsConfig
  next?: TrackNext
  options?: (TrackOptions | TrackOptionsSelect | TrackOptionsInput)[]
  form?: FormOptions
}

export interface TracksList {
  programs: Track[]
}

export interface UsedTrack {
  id: string | any
  component: TrackComponents | string
  category?: string
  final?: boolean
  completed: boolean
  // updating: boolean,
  step: number
  // values: any[] | null,
  // titles?: Translations[],
  // val: any[] | null,
  // data: object,
  selected: TrackOptions[]
  next: any
}

// FOR TRACKS - COMPONENTS

export interface TrackOpt {
  value: string
  [name: string]: any
}

export interface TrackChoice {
  id: string | number
  step: number
  values: string[] | object[]
  // val: object[],
  data?: object | object[]
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

export const isTrackOptionsInput = (
  option: TrackOptionsInput | TrackOptions
): option is TrackOptionsInput => {
  return 'hasInput' in option
}

export enum TrackHelpValue {
  Unknown = 'unknown',
  Precise = 'precise'
}
