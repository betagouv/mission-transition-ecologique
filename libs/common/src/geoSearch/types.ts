export type Commune = {
  codesPostaux: string[]
  nom: string
  code: string // Code INSEE
  departement: {
    code: string
    nom: string
  }
  region: {
    code: string
    nom: string
  }
}

export type ConvertedCommune = Omit<Commune, 'codesPostaux'> & {
  codePostal: string
}
