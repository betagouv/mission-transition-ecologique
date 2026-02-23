import { BaserowFaq } from '../../../src/common/baserow/types'

const pages = {
  faq: {
    id: 3827578,
    value: 'FAQ',
    color: 'orange'
  },
  accueil: {
    id: 3827575,
    value: 'Accueil',
    color: 'blue'
  },
  unknown: {
    id: 999,
    value: 'Unknown Page',
    color: 'blue'
  }
}

// Définition des sections communes
const sections = {
  section1: {
    id: 1,
    value: 'section 1',
    order: '1.00000000000000000000'
  },
  pourQui: {
    id: 2,
    value: 'Pour qui ?',
    order: '2.00000000000000000000'
  },
  commentMarche: {
    id: 1,
    value: 'Comment marche cet outil ?',
    order: '3.00000000000000000000'
  },
  pourquoi: {
    id: 3,
    value: 'Pourquoi ?',
    order: '4.00000000000000000000'
  },
  unknown: {
    id: 99,
    value: 'Unknown Section',
    order: '4.00000000000000000000'
  },
  projectSection1: {
    id: 1,
    value: 'Project Section 1',
    order: '1.00000000000000000000'
  }
}

export const faqBaserow = [
  {
    id: 1,
    order: '1.70000000000000000000',
    'Id Unique': 1,
    Question: 'question 3',
    Réponse: 'réponse 3',
    Actif: true,
    Page: pages.faq,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.section1],
    Projet: []
  },
  {
    id: 4,
    order: '1.00000000000000000000',
    'Id Unique': 4,
    Question: 'question 1',
    Réponse: 'réponse 1',
    Actif: true,
    Page: pages.faq,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.section1],
    Projet: []
  },
  {
    id: 3,
    order: '1.50000000000000000000',
    'Id Unique': 3,
    Question: 'question 2',
    Réponse: 'réponse 2',
    Actif: true,
    Page: pages.faq,
    'Dernière modification': '2025-07-30',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.pourQui],
    Projet: []
  },
  {
    id: 2,
    order: '2.00000000000000000000',
    'Id Unique': 2,
    Question: 'question 4',
    Réponse: 'réponse 4.',
    Actif: true,
    Page: pages.faq,
    'Dernière modification': '2025-07-31',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.commentMarche],
    Projet: []
  },
  {
    id: 67,
    order: '4.00000000000000000000',
    'Id Unique': 5,
    Question: 'question 5',
    Réponse: 'réponse 5',
    Actif: true,
    Page: pages.accueil,
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.pourquoi],
    Projet: []
  },
  {
    id: 133,
    order: '5.00000000000000000000',
    'Id Unique': 71,
    Question: '',
    Réponse: 'réponse 6',
    Actif: true,
    Page: pages.accueil,
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.pourquoi],
    Projet: []
  },
  {
    id: 140,
    order: '8.00000000000000000000',
    'Id Unique': 78,
    Question: 'question 7',
    Réponse: null,
    Actif: true,
    Page: pages.accueil,
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.pourquoi],
    Projet: []
  },
  {
    id: 999,
    order: '9.00000000000000000000',
    'Id Unique': 999,
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Question: 'question 8',
    Réponse: 'réponse 8',
    Actif: true,
    Page: pages.unknown,
    Section: [sections.commentMarche],
    Projet: []
  },
  {
    id: 150,
    order: '10.00000000000000000000',
    'Id Unique': 78,
    Question: 'question 7',
    Réponse: null,
    Actif: true,
    Page: pages.accueil,
    'Dernière modification': '2025-09-08',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.unknown],
    Projet: []
  }
] as unknown as BaserowFaq[]

export const faqsWithProjects = [
  {
    id: 1003,
    order: '2.00000000000000000000',
    'Id Unique': 1003,
    Question: 'Project FAQ question 2',
    Réponse: 'Project FAQ answer 2',
    Actif: true,
    Page: null,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [sections.projectSection1],
    Projet: [
      {
        id: 1,
        value: 'Test Project 1'
      }
    ]
  },
  {
    id: 1001,
    order: '1.00000000000000000000',
    'Id Unique': 1001,
    Question: 'Project FAQ question 1',
    Réponse: 'Project FAQ answer 1',
    Actif: true,
    Page: null,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [],
    Projet: [
      {
        id: 1,
        value: 'Test Project 1'
      }
    ]
  },
  {
    id: 1002,
    order: '1.50000000000000000000',
    'Id Unique': 1002,
    Question: 'Project FAQ question 3',
    Réponse: 'Project FAQ answer 3',
    Actif: true,
    Page: null,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [],
    Projet: [
      {
        id: 2,
        value: 'Test Project 2'
      }
    ]
  },
  {
    id: 1004,
    order: '3.00000000000000000000',
    'Id Unique': 1004,
    Question: 'Project and Page FAQ question',
    Réponse: 'Project and Page FAQ answer',
    Actif: true,
    Page: pages.accueil,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [],
    Projet: [
      {
        id: 1,
        value: 'Test Project 1'
      }
    ]
  },
  {
    id: 1007,
    order: '6.00000000000000000000',
    'Id Unique': 1007,
    Question: 'Non-existent project FAQ question',
    Réponse: 'Non-existent project FAQ answer',
    Actif: true,
    Page: null,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [],
    Projet: [
      {
        id: 999,
        value: 'Non-existent Project'
      }
    ]
  },
  {
    id: 1008,
    order: '7.00000000000000000000',
    'Id Unique': 1008,
    Question: 'Missing Project or Page FAQ question',
    Réponse: 'Non-existent project FAQ answer',
    Actif: true,
    Page: null,
    'Dernière modification': '2025-09-04',
    'Dernière modification par': {
      id: 81214,
      name: 'Master ADEME'
    },
    Section: [],
    Projet: []
  }
] as unknown as BaserowFaq[]
