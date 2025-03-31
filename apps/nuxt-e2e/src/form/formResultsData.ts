import { FormResultDataType } from '../resultDataType'

/*
----- cas de formulaire success (1-7):
- 1: j'ai un projet en tete > projet
- 2: j'ai un projet en tete > projet > program
- 3: catalogue > aide
- 4: catalogue > projet
- 5: je ne sais pas par ou commencer > projet
- 6: je ne sais par ou commencer > aide
- 7: je ne sais pas par ou commencer > projet > aide
- 8: je ne sais pas par ou commencer > projet custom
- 9: j'ai un projet en tete > projet custom
- 10: j'ai un projet en tete > projet sans titre
- 11: catalogue > aide avec infos manuelles

----- cas de formulaire fail:
- 12: je ne sais pas par ou commencer > projet > aide cgu pas sélectionné
- 13: je ne sais pas par ou commencer > projet mail invalide

*/
export const tests: FormResultDataType[] = [
  {
    id: 1,
    valid: true,
    type: 'project',
    url: 'questionnaire/resultat/projet/isolation-thermique?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      projectTitle: { value: 'Isolation thermique', type: 'text' },
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      needs: { value: '', type: 'textarea' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 2,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/projet/isolation-thermique/renovation-petit-tertiaire-prive?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      needs: { value: '', type: 'textarea' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 3,
    valid: true,
    type: 'program',
    autonomousActivation: true,
    url: 'aides-entreprise/act-pas-a-pas?siret=83014132100034&effectif=TPE',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 4,
    valid: true,
    type: 'project',
    url: 'projets-entreprise/diag-360?siret=83014132100034&effectif=TPE',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 5,
    valid: true,
    type: 'project',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      needs: { value: '', type: 'textarea' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 6, //activable en autonomie -> pas de form
    valid: true,
    type: 'program',
    autonomousActivation: true,
    url: 'questionnaire/resultat/formation-engager-entreprise-transition-ecologique?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {}
  },
  {
    id: 7,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/projet/strategie-rse/mission-conseil-rse?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      needs: { value: '', type: 'textarea' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 8,
    valid: true,
    type: 'customProject',
    url: 'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      projectTitle: { value: 'test', type: 'text' },
      theme: { value: '⚡️ énergie', type: 'select' },
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 9, //OK
    valid: true,
    type: 'customProject',
    url: 'questionnaire/resultat?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      projectTitle: { value: 'test', type: 'text' },
      theme: { value: '🏢 rénovation', type: 'select' },
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      needs: { value: '', type: 'textarea' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 10,
    valid: false,
    type: 'project',
    url: 'questionnaire/resultat/projet/isolation-thermique?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: {
      projectTitle: { value: '', type: 'text' },
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      needs: { value: '', type: 'textarea' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 11,
    valid: true,
    manual: true,
    type: 'program',
    url: 'aides-entreprise/act-pas-a-pas',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      needs: { value: '', type: 'textarea' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  },
  {
    id: 12,
    valid: false,
    type: 'project',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      projectTitle: { value: 'Sensibilisation des équipes', type: 'text' },
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      needs: { value: '', type: 'textarea' },
      email: { value: 'test@', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: true, type: 'checkbox' }
    }
  }
]
