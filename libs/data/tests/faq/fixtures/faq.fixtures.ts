import { BaserowFaq } from '../../../src/common/baserow/types'

export const faqBaserow = [
  {
    id: 1,
    order: '1.80000000000000000000',
    'Id Unique': 1,
    Réponse: 'réponse 1',
    Actif: true,
    Page: {
      id: 3827578,
      value: 'FAQ',
      color: 'orange'
    },
    Question: 'question 1',
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 1,
        value: 'section 1',
        order: '1.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 4,
    order: '1.00000000000000000000',
    'Id Unique': 1,
    Réponse: 'réponse 2',
    Actif: true,
    Page: {
      id: 3827578,
      value: 'FAQ',
      color: 'orange'
    },
    Question: 'question 2',
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 1,
        value: 'section 1',
        order: '1.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 3,
    order: '1.50000000000000000000',
    'Id Unique': 3,
    Réponse: 'réponse 3',
    Actif: true,
    Page: {
      id: 3827578,
      value: 'FAQ',
      color: 'orange'
    },
    Question: 'question 3',
    'Dernière modification': '2025-07-30',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 2,
        value: 'Pour qui ?',
        order: '2.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 2,
    order: '2.00000000000000000000',
    'Id Unique': 2,
    Réponse: 'réponse 4.',
    Actif: true,
    Page: {
      id: 3827578,
      value: 'FAQ',
      color: 'orange'
    },
    Question: 'question 4',
    'Dernière modification': '2025-07-31',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 1,
        value: 'Comment marche cet outil ?',
        order: '1.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 67,
    order: '4.00000000000000000000',
    'Id Unique': 5,
    Réponse: 'réponse 5',
    Actif: true,
    Page: {
      id: 3827575,
      value: 'Accueil',
      color: 'blue'
    },
    Question: 'question 5',
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 34,
        value: 'Pourquoi ?',
        order: '3.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 133,
    order: '5.00000000000000000000',
    'Id Unique': 71,
    Réponse: 'réponse 6',
    Actif: true,
    Page: {
      id: 3827575,
      value: 'Accueil',
      color: 'blue'
    },
    Question: '',
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 34,
        value: 'Pourquoi ?',
        order: '3.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 140,
    order: '8.00000000000000000000',
    'Id Unique': 78,
    Réponse: null,
    Actif: true,
    Page: {
      id: 3827575,
      value: 'Accueil',
      color: 'blue'
    },
    Question: 'question 7',
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 34,
        value: 'Pourquoi ?',
        order: '3.00000000000000000000'
      }
    ],
    Projet: []
  },
  {
    id: 141,
    order: '9.00000000000000000000',
    'Id Unique': 79,
    Réponse: 'réponse 8',
    Actif: false,
    Page: {
      id: 3827575,
      value: 'Accueil',
      color: 'blue'
    },
    Question: 'question 8',
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [
      {
        id: 34,
        value: 'Pourquoi ?',
        order: '3.00000000000000000000'
      }
    ],
    Projet: []
  }
] as unknown as BaserowFaq[]

export const inactiveFaqs: BaserowFaq[] = [
  {
    id: 1,
    Question: 'Inactive question',
    Réponse: 'Inactive answer',
    Actif: false,
    Page: { id: 1, value: 'Accueil', Couleur: 'blue' },
    Section: [{ id: 1, value: 'Test', order: '1.0' }],
    order: 1,
    Projet: []
  }
]
