import { FormResultDataType } from './resultDataType'

/*
----- cas de formulaire success (1-7): 
- 1: j'ai un projet en tete > projet
- 2: j'ai un projet en tete > projet > program
- 3: catalogue > aide 
- 4: je ne sais pas par ou commencer > projet
- 5: je ne sais par ou commencer > aide
- 6: je ne sais pas par ou commencer > projet > aide
- 7: je ne sais pas par ou commencer > projet custom
- 8: j'ai un projet en tete > projet custom
- 9: j'ai un projet en tete > projet sans titre 

----- cas de formulaire fail: 
- 10: j'ai un projet en tete > projet custom siret invalide
- 11: je ne sais pas par ou commencer > projet > aide cgu pas sélectionné 
- 12: je ne sais pas par ou commencer > projet mail invalide

*/
export const tests: FormResultDataType[]  = [
  {
    id: 1,
    valid: true,
    type: 'project',
    url: 'questionnaire/resultat/projet/isolation-thermique?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      projectTitle: {value: 'Isolation thermique', type: 'text'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '83014132100034', type: 'text'},
      needs: {value: 'test', type: 'textarea'},
      cgu: {value: true, type: 'checkbox'}
    } 
  },
  {
    id: 2,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/projet/isolation-thermique/renovation-petit-tertiaire-prive?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '83014132100034', type: 'text'},
      needs: {value: 'test', type: 'textarea'},
      cgu: {value: true, type: 'checkbox'}
    } 
  },
  {
    id: 3,
    valid: true,
    type: 'program',
    url: 'aides-entreprise/act-pas-a-pas',
    values: {
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '83014132100034', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    } 
  },
  {
    id: 4,
    valid: true,
    type: 'project',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      projectTitle: {value: 'Sensibilisation des équipes', type: 'text'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '21490007800012', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    } 
  }, 
  {
    id: 5,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/formation-engager-entreprise-transition-ecologique?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '21490007800012', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    }   
  },
  {
    id: 6,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes/formation-engager-entreprise-transition-ecologique?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '21490007800012', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    }   
  },
  {
    id: 7,
    valid: true,
    type: 'custom-project',
    url: 'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      projectTitle: {value: 'test', type: 'text'},
      theme: {value: '⚡️ énergie', type: 'select'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '21490007800012', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    }   
  },
  {
    id: 8,
    valid: true,
    type: 'custom-project',
    url: 'questionnaire/resultat?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      projectTitle: {value: 'test', type: 'text'},
      theme: {value: '🏢 rénovation', type: 'select'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '83014132100034', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    }   
  },
  {
    id: 9,
    valid: false,
    type: 'project',
    url: 'questionnaire/resultat/projet/isolation-thermique?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      projectTitle: {value: '', type: 'text'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '83014132100034', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    } 
  },
  {
    id: 10,
    valid: false,
    type: 'custom-project',
    url: 'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      projectTitle: {value: 'test', type: 'text'},
      theme: {value: '⚡️ énergie', type: 'select'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '21490012', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    }   
  },
  {
    id: 11,
    type: 'program',
    valid: false,
    url: 'questionnaire/resultat/formation-engager-entreprise-transition-ecologique?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@test.fr', type: 'email'},
      siret: {value: '21490007800012', type: 'text'},
      cgu: {value: false, type: 'checkbox'}
    }   
  },
  {
    id: 12,
    valid: false,
    type: 'project',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      projectTitle: {value: 'Sensibilisation des équipes', type: 'text'},
      name: {value: 'test', type: 'text'},
      surname: {value: 'test', type: 'text'},
      tel: {value: '0123456789', type: 'tel'},
      email: {value: 'test@', type: 'email'},
      siret: {value: '21490007800012', type: 'text'},
      cgu: {value: true, type: 'checkbox'}
    } 
  }
]