
// FOR AID PROGRAMS 

export interface ProgramConditions {
  project_needs?: string[],
  project_status?: string[],
  project_sectors?: string[],
  structure_sizes?: string[],
}
export interface ProgramData {
  index?: string | number,
  title: string,
  resume?: string,
  description?: string,
  program_type?: string
  program_conditions?: ProgramConditions
}


// FOR TRACKS

export interface Translations {
  fr: string,
  [name: string]: string
}
export interface TrackInterface {
  component: string,
  columnWidth?: number,
}
export interface TrackBehavior {
  multipleChoices: boolean,
  operator?: string,
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
  values: any[],
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
  data?: object | object[]
}

// FOR FORMS

export interface FormValues {
  [name: string]: any,
}

export interface FormField {
  id: string,
  required: boolean,
  label?: any,
  hint?: any,
  type?: string
}

export interface FormOptions {
  value: string | number,
  label?: any | null,
  intro?: any | null,
  fields?: FormField[],
  next?: string
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
  options?: object | null
}
export interface Comp {
  name: string,
  comp: object
}