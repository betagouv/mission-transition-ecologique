import { ResultsDataType } from './resultDataType'

/* cas de formulaire : 
- 'j'ai un projet en tete' : projet simple / aide depuis projet
- catalog aide 
- 'je ne sais pas par ou commencer' : projet simple / aide / aide depuis projet
*/
export const tests: ResultsDataType = [
  {
    id: 1,
    url: 'questionnaire/resultat/projet/isolation-thermique?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: ['John', 'Doe', "test@test.fr", '83014132100034' ]
  },
  {
    id: 2,
    url: 'questionnaire/resultat/projet/isolation-thermique/renovation-petit-tertiaire-prive?choix-du-parcours=j-ai-un-projet&siret=83014132100034&effectif=TPE&objectifs=building',
    values: ['Formation ADEME']
  },
  {
    id: 3,
    url: 'aides-entreprise/act-pas-a-pas',
    values: []
  },
  {
    id: 4,
    url: 'questionnaire/resultat?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=82141193100016&effectif=ME&locaux=proprietaire&mobilite=oui&matieres-premieres=oui&tri-dechets=non&dechets=oui&gestion-eau=oui&energie=oui&audit=oui&selection-audit=consommation-energie&selection-audit=eau&selection-audit=performance-energetique&selection-audit=bilan-carbone&selection-audit=certification&selection-audit=matieres-premieres&selection-audit=dechets#questionnaire-resultat',
    values: []
  },
  {
    id: 5,
    url: 'questionnaire/resultat/projet/sensibilisation-equipes?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: []
  }, 
  {
    id: 6,
    url: 'questionnaire/resultat/formation-engager-entreprise-transition-ecologique?choix-du-parcours=je-ne-sais-pas-par-ou-commencer&siret=21490007800012&effectif=PE&locaux=proprietaire-et-locataire&mobilite=maximum&matieres-premieres=maximum&tri-dechets=oui&dechets=non&gestion-eau=non&energie=non&audit=non',
    values: []  
  }
]
