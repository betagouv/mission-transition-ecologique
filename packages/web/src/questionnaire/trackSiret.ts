import { secteurs, NAF1ToVar, NAF1Letters, codesNAF1 } from './publicodesObjects'

const metaEnv = import.meta.env
// console.log('trackSiret >  metaEnv :', metaEnv)
const TEE_BACKEND_URL = metaEnv.VITE_TEE_BACKEND_URL || 'https://tee-backend.osc-fr1.scalingo.io'

const dataTarget = {
  siret: '',
  codeNaf: '',
  codeNAF1: '',
  ville: '',
  codePostal: '',
  structure_sizes: '',
  denomination: '',
  // project_sectors: undefined,
  secteur: undefined
}

export const siret = {
  id: 'track_siret',
  category: 'myEntreprise',
  title: { fr: 'Mon SIRET' },
  label: { fr: 'Quelle est votre entreprise ?' },
  // info: { fr: "Renseignez le SIRET de votre entreprise" },
  interface: {
    component: 'input'
  },
  // behavior: {
  //   multipleChoices: false,
  // },
  next: {
    default: 'track_structure_workforce'
  },
  options: [
    {
      id: 'search-siret',
      value: { ...dataTarget },
      title: { fr: 'SIRET' },
      // label: { fr: 'Renseignez le SIRET de votre entreprise (14 chiffres)' },
      placeholder: { fr: 'Votre numéro SIRET (14 chiffres)' },
      hint: { fr: `Besoin d'aide pour retrouver votre SIRET ? <a href="https://annuaire-entreprises.data.gouv.fr/" target="_blank">Cliquez ici</a>` },
      // for debugging purposes
      // Examples =>
      // defaultInput: '830 141 321 00034',
      // defaultInput: '82200690400012', // - boulangerie
      // defaultInput: '83014132100034', // - TPE
      // defaultInput: '81759468200020', // - auto-entreprise
      postResponses: {
        fr: 'Vous ne retrouvez pas votre SIRET ? <a href="https://annuaire-entreprises.data.gouv.fr/" target="_blank">Cliquez ici</a>'
      },
      // required: false,
      callbacks: [
        {
          disabled: false,
          help: 'Get entreprise data from its SIRET number',
          helpDocumentation: 'https://tee-backend.osc-fr1.scalingo.io/api/docs',
          action: 'requestAPI',
          url: `${TEE_BACKEND_URL}/api/insee/get_by_siret`,
          // url: 'http://localhost:8001/api/insee/get_by_siret',
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          dataBody: { siret: '' },
          dataStructure: { ...dataTarget },
          dataMapping: [
            {
              from: 'formData',
              id: 'inputValue',
              dataField: 'siret'
            },
            {
              from: 'rawData',
              id: 'naf',
              help: 'https://www.insee.fr/fr/information/2120875',
              path: 'etablissement.uniteLegale.activitePrincipaleUniteLegale',
              dataField: 'codeNaf',
              onlyRemap: true
            },
            // {
            //   from: 'rawData',
            //   id: 'sector',
            //   path: 'etablissement.uniteLegale.activitePrincipaleUniteLegale',
            //   dataField: 'project_sectors',
            //   onlyRemap: true,
            //   cleaning: [
            //     {
            //       operation: 'findFromRefs',
            //       findInRef: 'nafCodes',
            //       findFromField: 'NIV5',
            //       retrieveFromField: 'tags'
            //     }
            //   ]
            // },
            {
              from: 'rawData',
              id: 'secteur',
              path: 'etablissement.uniteLegale.activitePrincipaleUniteLegale',
              dataField: '.',
              onlyRemap: true,
              cleaning: [
                {
                  operation: 'findFromRefs',
                  findInRef: 'nafCodes',
                  findFromField: 'NIV5',
                  retrieveFromField: 'tagsFr'
                  // => ['artisanat', 'industrie']
                },
                {
                  operation: 'findFromDict',
                  dict: {
                    artisanat: { "entreprise . secteur d'activité . est artisanat": 'oui' },
                    industrie: { "entreprise . secteur d'activité . est industrie": 'oui' },
                    tourisme: { "entreprise . secteur d'activité . est tourisme": 'oui' },
                    tertiaire: { "entreprise . secteur d'activité . est tertiaire": 'oui' },
                    agriculture: { "entreprise . secteur d'activité . est agriculture": 'oui' },
                    'autre secteur': {
                      "entreprise . secteur d'activité . est autre secteur": 'oui'
                    }
                  }
                  // => [{ "entreprise . secteur d'activité . est artisanat": 'oui' }, { "entreprise . secteur d'activité . est tertiaire": 'oui' }]
                },
                {
                  operation: 'injectInObject',
                  object: { ...secteurs }
                  /* => {
                    {
                      "entreprise . secteur d'activité . est artisanat": 'non',
                      "entreprise . secteur d'activité . est industrie": 'non',
                      "entreprise . secteur d'activité . est tourisme": 'non',
                      "entreprise . secteur d'activité . est tertiaire": 'non',
                      "entreprise . secteur d'activité . est agriculture": 'non',
                      "entreprise . secteur d'activité . est autre secteur": 'non'
                    }
                  */
                }
              ]
            },
            {
              from: 'rawData',
              id: 'codeNAF1',
              path: 'etablissement.uniteLegale.activitePrincipaleUniteLegale',
              dataField: '.',
              onlyRemap: true,
              cleaning: [
                {
                  operation: 'findFromRefs',
                  findInRef: 'nafCodes',
                  findFromField: 'NIV5',
                  retrieveFromField: 'NIV1'
                  // => 'A'
                },
                {
                  operation: 'findFromDict',
                  dict: Object.fromEntries(NAF1Letters.map((l) => [l, { [NAF1ToVar(l)]: 'oui' }]))
                  // => { "entreprise . code NAF . est A": 'oui' }
                },
                {
                  operation: 'injectInObject',
                  object: { ...codesNAF1 }
                  /* => {
                      "entreprise . code NAF . est A": 'oui',
                      "entreprise . code NAF . est B": 'non',
                      ...
                    }
                  */
                }
              ]
            },
            {
              from: 'rawData',
              id: 'sectorLabel',
              path: 'etablissement.uniteLegale.activitePrincipaleUniteLegale',
              dataField: 'secteur',
              onlyRemap: true,
              cleaning: [
                {
                  operation: 'findFromRefs',
                  findInRef: 'nafCodes',
                  findFromField: 'NIV5',
                  retrieveFromField: 'label_vf'
                }
              ]
            },
            {
              from: 'rawData',
              id: 'denomination',
              path: 'etablissement.uniteLegale.denominationUniteLegale',
              dataField: 'denomination',
              onlyRemap: true
            },
            {
              from: 'rawData',
              id: 'city',
              path: 'etablissement.adresseEtablissement.libelleCommuneEtablissement',
              dataField: 'ville',
              onlyRemap: true
            },
            {
              from: 'rawData',
              id: 'postalCode',
              path: 'etablissement.adresseEtablissement.codePostalEtablissement',
              dataField: 'codePostal',
              onlyRemap: true
            }
            // {
            //   from: 'rawData',
            //   id: 'size',
            //   path: 'etablissement.uniteLegale.categorieEntreprise',
            //   dataField: 'structure_sizes',
            //   onlyRemap: true
            // },
          ],
          inputCleaning: [
            {
              operation: 'replaceAll',
              stringToReplace: ' ',
              replaceBy: ''
            }
          ],
          resultsMapping: [
            {
              respFields: ['data.denomination', 'data.siret'],
              position: 'title',
              // label: 'entité',
              class: 'fr-mb-3v',
              sep: ' - SIRET ',
              style: 'font-weight: bold;',
              cleaning: [
                {
                  operation: 'defaultIfNull',
                  // respFields: 'data.denomination',
                  defaultValue: { fr: 'Auto-entreprise' }
                }
              ]
            },
            // {
            //   respFields: ['data.codeNaf'],
            //   label: 'Code NAF :',
            //   icon: 'fr-icon-briefcase-line'
            // },
            {
              respFields: ['data.secteur'],
              label: "Secteur d'activité :",
              icon: 'fr-icon-briefcase-line'
            },
            // {
            //   respFields: ['data.structure_sizes'],
            //   // label: 'Catégorie :',
            //   icon: 'fr-icon-parent-line',
            //   cleaning: [
            //     {
            //       operation: 'defaultIfNull',
            //       // respFields: 'data.structure_sizes',
            //       defaultValue: { fr: 'Autre' }
            //     },
            //     {
            //       operation: 'findFromDict',
            //       dict: {
            //         Autre: 'Auto-Entrepreneur.e',
            //         TPE: 'TPE (entre 1 et 19 salarié.e.s)',
            //         PME: 'PME (entre 20 et 250 salarié.e.s)',
            //         ETI: 'ETI (entre 250 et 5000 salarié.e.s)',
            //         GE: 'Grande Entreprise (plus de 5000 salarié.e.s)'
            //       }
            //     }
            //   ]
            // },
            {
              respFields: [
                'raw.etablissement.adresseEtablissement.numeroVoieEtablissement',
                'raw.etablissement.adresseEtablissement.typeVoieEtablissement',
                'raw.etablissement.adresseEtablissement.libelleVoieEtablissement',
                'data.codePostal',
                'data.ville'
              ],
              // label: 'Adresse',
              icon: 'fr-icon-map-pin-2-line'
            },
            {
              respFields: ['raw.etablissement.uniteLegale.dateCreationUniteLegale'],
              label: 'Création le',
              // prefix: 'Création le ',
              icon: 'fr-icon-time-line',
              cleaning: [
                {
                  operation: 'stringToDate'
                }
              ]
            }
          ]
        }
      ],
      next: {
        default: 'track_structure_workforce'
        // default: 'track_structure_sizes',
        // exceptions: nextExceptions
        // default: 'track_roles'
      },
      wildcard: {
        label: { fr: 'je préfère compléter mes informations manuellement' },
        next: {
          default: 'track_structure_workforce'
          // default: 'track_structure_sizes',
          // exceptions: nextExceptions
        }
      }
    }
  ]
}
