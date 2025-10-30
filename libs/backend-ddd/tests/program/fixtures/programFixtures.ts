import { ProgramType, ProgramAidType } from '@tee/data'
import { ThemeId } from '@tee/common'

/**
 * Fixture programs based on programs.json for testing ProgramFeatures
 * These fixtures cover various eligibility scenarios without including publicode rules
 */

export const validProgram: ProgramType = {
  id: 'valid-program',
  titre: 'Programme Valide',
  promesse: 'Un programme sans restrictions',
  description: 'Programme accessible à tous',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '1000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['texte', 'texte'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Éligible à toutes les entreprises']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
    }
  }
}

export const programWithDateValidity: ProgramType = {
  id: 'program-with-dates',
  titre: 'Programme avec dates',
  promesse: 'Programme temporaire',
  description: 'Programme limité dans le temps',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '2000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['texte', 'texte'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
    },
    validity: {
      start: '01/01/2024',
      end: '31/12/2024'
    }
  }
}

export const programWithExpiredDates: ProgramType = {
  id: 'program-expired',
  titre: 'Programme expiré',
  promesse: 'Programme qui a expiré',
  description: "Programme qui n'est plus valide",
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '2000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['texte', 'texte'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
    },
    validity: {
      start: '01/01/2020',
      end: '31/12/2020'
    }
  }
}

export const programWithMinEmployees: ProgramType = {
  id: 'program-min-employees',
  titre: 'Programme grandes entreprises',
  promesse: 'Réservé aux grandes structures',
  description: 'Programme pour entreprises de 50 salariés minimum',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': "Banque Publique d'Investissement France",
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '5000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['texte', 'texte'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Au moins 3 ans']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
      minEmployees: 50
    }
  }
}

export const programWithMaxEmployees: ProgramType = {
  id: 'program-max-employees',
  titre: 'Programme TPE/PME',
  promesse: 'Réservé aux petites structures',
  description: "Programme pour entreprises jusqu'à 250 salariés",
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.fund,
  "coût de l'accompagnement": '3000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['texte', 'texte'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
      maxEmployees: 250
    }
  }
}

export const programExcludingMicroentrepreneur: ProgramType = {
  id: 'program-no-microentrepreneur',
  titre: 'Programme hors micro-entrepreneurs',
  promesse: 'Non accessible aux micro-entrepreneurs',
  description: 'Programme excluant les micro-entrepreneurs',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': "Banque Publique d'Investissement France",
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '4000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['Toutes tailles', 'Non éligible aux micro-entreprises'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Au moins 2 ans']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
      excludeMicroentrepreneur: true
    }
  }
}

export const programWithNafRestriction: ProgramType = {
  id: 'program-naf-restriction',
  titre: 'Programme industrie',
  promesse: 'Réservé aux secteurs industriels',
  description: 'Programme pour les secteurs B, C, D',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.fund,
  "coût de l'accompagnement": '6000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['Toutes tailles', 'Éligible aux micro-entreprises'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Industrie extractive', 'Industrie manufacturière'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['B', 'C', 'D']
    }
  }
}

export const programWithRegionRestriction: ProgramType = {
  id: 'program-region-restriction',
  titre: 'Programme Île-de-France',
  promesse: 'Réservé à la région Île-de-France',
  description: 'Programme régional',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'Région Île-de-France',
  "nature de l'aide": ProgramAidType.fund,
  "coût de l'accompagnement": '2500 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['Toutes tailles', 'Éligible aux micro-entreprises'],
    'secteur géographique': ['Île-de-France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
      allowedRegion: ['Île-de-France']
    }
  }
}

export const programWithEnergyObjective: ProgramType = {
  id: 'program-energy-objective',
  titre: 'Programme performance énergétique',
  promesse: 'Améliorer votre performance énergétique',
  description: "Programme dédié à l'énergie",
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '3500 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['Toutes tailles', 'Éligible aux micro-entreprises'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
    },
    priorityObjectives: [ThemeId.Energy]
  }
}

export const programWithEnvironmentalObjective: ProgramType = {
  id: 'program-environmental-objective',
  titre: 'Programme impact environnemental',
  promesse: 'Évaluez votre impact environnemental',
  description: 'Programme pour bilan environnemental',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.study,
  "coût de l'accompagnement": '4500 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['Toutes tailles', 'Éligible aux micro-entreprises'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
    },
    priorityObjectives: [ThemeId.Environmental]
  }
}

export const programWithMultipleObjectives: ProgramType = {
  id: 'program-multiple-objectives',
  titre: 'Programme multi-objectifs',
  promesse: 'Programme complet',
  description: 'Programme avec plusieurs objectifs',
  illustration: 'images/test.png',
  objectifs: [],
  'opérateur de contact': 'ADEME',
  "nature de l'aide": ProgramAidType.train,
  "coût de l'accompagnement": '7000 €',
  "conditions d'éligibilité": {
    "taille de l'entreprise": ['Toutes tailles', 'Éligible aux micro-entreprises'],
    'secteur géographique': ['France'],
    "secteur d'activité": ['Tous secteurs'],
    "nombre d'années d'activité": ['Aucune restriction']
  },
  publicodes: {
    'entreprise . est ciblée': {}
  },
  eligibilityData: {
    company: {
      allowedNafSections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
    },
    priorityObjectives: [ThemeId.Energy, ThemeId.Water, ThemeId.Waste]
  }
}

export const allFixturePrograms: ProgramType[] = [
  validProgram,
  programWithDateValidity,
  programWithExpiredDates,
  programWithMinEmployees,
  programWithMaxEmployees,
  programExcludingMicroentrepreneur,
  programWithNafRestriction,
  programWithRegionRestriction,
  programWithEnergyObjective,
  programWithEnvironmentalObjective,
  programWithMultipleObjectives
]
