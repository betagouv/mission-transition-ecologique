import { Program } from '../domain/type/types'

interface OpenAPISafeEligibility {
  // Tsoa does not work well with TupleType due to some limitations
  // in OpenAPI for dealing with heterogeneous tuples.
  "conditions d'éligibilité": {
    "secteur d'activité": string[]
    'secteur géographique': string[]
    "taille de l'entreprise": string[]
    "nombre d'années d'activité": string[]
    "autres critères d'éligibilité"?: string[]
    [k: string]: unknown
  }
}

export type OpenAPISafeProgram = Omit<Program, "conditions d'éligibilité"> & OpenAPISafeEligibility
