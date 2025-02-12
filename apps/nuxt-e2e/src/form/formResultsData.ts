import { FormResultDataType } from '../resultDataType'

/*
----- cas de formulaire success (1-7):
- 1: catalogue > aide
- 2: catalogue > projet
- 3: questionnaire > projet
- 4: questionnaire > aide
- 5: questionnaire > projet > aide
- 6: catalogue > projet custom
- 7: questionnaire > projet sans titre
- 8: catalogue > aide avec infos manuelles

----- cas de formulaire fail:
- 9: questionnaire > projet > aide cgu pas sélectionné
- 10: questionnaire > projet mail invalide

*/
export const tests: FormResultDataType[] = [
  {
    id: 1,
    valid: true,
    type: 'program',
    url: 'aides-entreprise/baisse-les-watts?siret=83014132100034&effectif=TPE',
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
    id: 2,
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
    id: 3,
    valid: true,
    type: 'project',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
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
    id: 4,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/formation-engager-entreprise-transition-ecologique?siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
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
    id: 5,
    valid: true,
    type: 'program',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes/formation-engager-entreprise-transition-ecologique?siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
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
    id: 6,
    valid: true,
    type: 'customProject',
    url: 'projets-entreprise',
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
    id: 7,
    valid: false,
    type: 'project',
    url: 'questionnaire/resultat/projet/isolation-thermique?siret=83014132100034&effectif=TPE&objectifs=building',
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
    id: 8,
    valid: true,
    manual: true,
    type: 'program',
    url: 'aides-entreprise/baisse-les-watts',
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
    id: 9,
    type: 'program',
    valid: false,
    url: 'questionnaire/resultat/formation-engager-entreprise-transition-ecologique?siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: {
      name: { value: 'test', type: 'text' },
      surname: { value: 'test', type: 'text' },
      tel: { value: '0123456789', type: 'tel' },
      email: { value: 'test@test.fr', type: 'email' },
      siret: { value: '83014132100034', type: 'text' },
      cgu: { value: false, type: 'checkbox' }
    }
  },
  {
    id: 10,
    valid: false,
    type: 'project',
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?siret=83014132100034&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
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
