
// FOR ENV 

export interface MetaEnv {
  VITE_DATA_DIR_PATH: string,
  VITE_DEPLOY_URL: string,
  VITE_BREVO_TOKEN: string,
  VITE_BREVO_LIST_IDS: string,
  VITE_BREVO_SENDER_EMAIL: string,
}

// FOR AID PROGRAMS 

export interface ProgramConditions {
  project_needs?: string[],
  project_status?: string[],
  project_sectors?: string[],
  structure_sizes?: string[],
}
enum ConditionOperators {
  or = 'or',
  and = 'and',
  superior = '>',
  superiorOrEqual = '>=',
  inferior = '>',
  inferiorOrEqual = '>=',
}
export interface Condition {
  type?: string,
  operator?: ConditionOperators,
  value?: any | any[],
}

export interface ProgramProvider {
  code: string,
  href?: string,
  SIREN?: string | number,
}

export interface ProgramData {
  index?: string | number,
  title: string,
  resume?: string,
  description?: string,
  program_type?: string,
  conditions?: Condition[],
  program_conditions?: ProgramConditions,
  program_providers?: string[] | ProgramProvider[] | any[],
  program_application?: any,
  geo_zones?: any,
  date_start?: any,
  date_end?: any,
}


// FOR TRACKS

export interface Translations {
  fr: string,
  [name: string]: string
}

enum TrackComponents {
  cards = 'cards',
  buttons = 'buttons'
}
export interface TrackInterface {
  component: TrackComponents,
  columnWidth?: number | string,
}
enum TrackBehaviorOperators {
  or = 'or'
}
export interface TrackBehavior {
  multipleChoices: boolean,
  operator?: TrackBehaviorOperators,
}
export interface TrackOptionsField {
  id: string,
  label: Translations,
  hint?: Translations,
  required?: boolean,
  type: string
}
export interface TrackNext {
  default: string,
  [name: string]: any
}
export interface TrackOptions {
  disabled?: Boolean,
  value: string | number,
  label: Translations,
  intro?: Translations,
  fields?: TrackOptionsField,
  hint?: Translations,
  next?: TrackNext
}
export interface Track {
  id: string,
  label: Translations,
  interface?: TrackInterface,
  behavior?: TrackBehavior,
  next?: TrackNext,
  options?: TrackOptions,
}

export interface TracksList {
  programs: Track[]
}

export interface UsedTrack {
  id: string | any,
  final?: boolean,
  completed: boolean,
  updating: boolean,
  step: number,
  values: any[] | null,
  // val: any[] | null,
  data: object,
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
  showAlert: boolean,
  showResultsTitle: boolean,
  showProgramInfos: boolean,
  showProgramSubtitles: boolean
}

// FOR FORMS

export interface FormValues {
  [name: string]: any,
}

enum FormFieldTypes {
  text = 'text',
  email = 'email',
  textarea = 'textarea',
  checkbox = 'checkbox',
}
export interface FormField {
  id: string,
  required: boolean,
  label?: any,
  hint?: any,
  cols?: number,
  type?: FormFieldTypes,
  defaultValue?: boolean | string | number
}

export interface FormOptions {
  value: string | number,
  label?: any | null,
  intro?: any | null,
  fields?: FormField[],
  next?: string,
  callbacks: FormCallback[]
}

export interface FormDataResp {
  value: string,
  next: string,
  data: any
}

// FOR TRANSLATIONS

export interface Dict {
  id: string,
  label: any,
}

// FOR COMPONENTS

export interface ColsOptions {
  [name: string]: number | string
}

export interface Plugin {
  plugin: any,
  options?: object | null,
  icons?: any[] | null
}
export interface Comp {
  name: string,
  comp: object
}

// FOR REQUESTS

export interface ReqResp {
  status?: number,
  code?: string,
  message?: string,
}

// FOR EMAILING

export interface EmailData {
  name: string,
  email: string,
}

enum DataMappingFroms {
  env = 'env',
  formData = 'formData',
  usedTracks = 'usedTracks',
}
export interface FormCallbackDataMapping {
  from: DataMappingFroms,
  id: string,
  dataField: string,
  asArray?: boolean
  sep?: string
  type?: string,
  subKey?: string
}

enum CallbackMethods {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
}
enum CallbackActions {
  createContact = 'createContact',
  sendTransactionalEmail = 'sendTransactionalEmail'
}
export interface FormCallback {
  disabled?: boolean,
  help?: string,
  helpDocumentation?: string,
  action: CallbackActions,
  url: string,
  headers: object,
  headerApiKey: string,
  envApiKey: string,
  method: CallbackMethods,
  dataStructure: object | object[],
  dataMapping: FormCallbackDataMapping[]
}