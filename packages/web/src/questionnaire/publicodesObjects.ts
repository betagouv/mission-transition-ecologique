// LEGACY
export const secteurs = {
  "entreprise . secteur d'activité . est artisanat": 'non',
  "entreprise . secteur d'activité . est industrie": 'non',
  "entreprise . secteur d'activité . est tourisme": 'non',
  "entreprise . secteur d'activité . est tertiaire": 'non',
  "entreprise . secteur d'activité . est agriculture": 'non',
  "entreprise . secteur d'activité . est autre secteur": 'non'
}

// NAF CODES
// Associates a NAF1 (composed of 1 letter) to its expected publicode variable
export const NAF1ToVar = (letter: string): string => `entreprise . code NAF niveau 1 . est ${letter}`

export const NAF1Letters = [...'ABCDEFGHIJKLMNOPQRSTU'] as const

// publicodes variable initialization to "non"
export const codesNAF1 = Object.fromEntries(NAF1Letters.map((l) => [NAF1ToVar(l), 'non']))

export const SecteurByNAF = {
  'artisanat': ['C', 'E', 'F', 'H', 'I'],
  'industrie': ['B', 'C', 'D', 'E', 'F'],
  'tourisme': ['A', 'I'],
  'tertiaire': ['G','H','I','J','K','L','M','N','O','P','Q','R','S'],
  'agriculture': ['A'],
  'autre secteur': ['T', 'U'],
}

// OBJECTIFS
export const objectifsPrioritaires = {
  'questionnaire . objectif prioritaire . est mon impact environnemental': 'non',
  'questionnaire . objectif prioritaire . est ma performance énergétique': 'non',
  "questionnaire . objectif prioritaire . est diminuer ma consommation d'eau": 'non',
  'questionnaire . objectif prioritaire . est rénover mon bâtiment': 'non',
  'questionnaire . objectif prioritaire . est la mobilité durable': 'non',
  'questionnaire . objectif prioritaire . est la gestion des déchets': 'non',
  "questionnaire . objectif prioritaire . est l'écoconception": 'non',
  'questionnaire . objectif prioritaire . est former ou recruter': 'non'
}