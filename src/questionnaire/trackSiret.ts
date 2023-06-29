export const siret = {
  id: 'track_siret',
  category: 'entreprise',
  title: { fr: 'Mon SIRET' },
  label: { fr: 'Quelle est votre entreprise ?' },
  // info: { fr: "Renseignez le SIRET de votre entreprise" },
  interface: {
    component: 'input',
  },
  // behavior: {
  //   multipleChoices: false,
  // },
  next: {
    default: 'track_structure_sizes'
  },
  options: [
    {
      id: 'search-siret',
      value: { structure_siret: undefined },
      title: { fr: 'SIRET' },
      label: { fr: "Renseignez le SIRET de votre entreprise" },
      placeholder: { fr: 'ex : 830 141 321 00034' },
      defaultInput: '830 141 321 00034',
      postResponses: { fr: 'Vous ne retrouvez pas votre SIRET ? <a href="https://annuaire-entreprises.data.gouv.fr/" target="_blank">Cliquez ici</a>' },
      // required: false,
      callbacks: [
        {
          disabled: false,
          help: 'Get entreprise data from its SIRET number',
          helpDocumentation: 'https://tee-backend-test.osc-fr1.scalingo.io/api/docs',
          action: 'getSiretInfos',
          url: 'https://tee-backend-test.osc-fr1.scalingo.io/api/insee/get_by_siret',
          urlLocal: 'https://tee-backend-test.osc-fr1.scalingo.io/api/insee/get_by_siret',
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          dataStructure: {
            siret: '',
            codeNaf: '',
            ville: '',
            codePostal: '',
          },
          dataMapping: [
            {
              from: 'formData',
              id: 'inputValue',
              dataField: 'siret',
            },
            {
              from: 'rawData',
              id: 'naf',
              path: 'etablissement.uniteLegale.activitePrincipaleUniteLegale',
              dataField: 'codeNaf',
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
            },
          ],
          dataCleaning: [
            {
              operation: 'replaceAll',
              stringToReplace: ' ',
              replaceBy: ''
            }
          ],
          resultsMapping: [
            {
              respFields: [
                'raw.etablissement.uniteLegale.denominationUniteLegale',
                'raw.etablissement.siret'
              ],
              position: 'title',
              // label: 'entité',
              class: 'fr-mb-3v',
              sep: ' - SIRET ',
              style: 'font-weight: bold;'
            },
            {
              respFields: [
                'raw.etablissement.adresseEtablissement.numeroVoieEtablissement',
                'raw.etablissement.adresseEtablissement.typeVoieEtablissement',
                'raw.etablissement.adresseEtablissement.libelleVoieEtablissement',
                'raw.etablissement.adresseEtablissement.codePostalEtablissement',
                'raw.etablissement.adresseEtablissement.libelleCommuneEtablissement',
              ],
              // label: 'Adresse',
              icon: 'fr-icon-map-pin-2-line'
            },
            {
              respFields: ['raw.etablissement.uniteLegale.categorieEntreprise'],
              label: 'Catégorie',
              icon: 'fr-icon-parent-line'
            },
            {
              respFields: ['raw.etablissement.uniteLegale.dateCreationUniteLegale'],
              label: 'Date de création',
              prefix: 'Création le ',
              icon: 'fr-icon-time-line'
            },
            {
              respFields: ['raw.etablissement.uniteLegale.activitePrincipaleUniteLegale'],
              label: 'Code NAF',
              icon: 'fr-icon-briefcase-line'
            },
            // {
            //   respFields: ['raw.etablissement.siret'],
            //   label: 'SIRET',
            //   icon: 'fr-icon-building-fill'
            // },
            // {
            //   respFields: ['raw.etablissement.siren'],
            //   label: 'SIRET',
            //   icon: 'fr-icon-building-fill'
            // },
            // {
            //   respFields: ['raw.etablissement.nic'],
            //   label: 'NIC',
            //   icon: 'fr-icon-building-fill'
            // },
          ]
        }
      ],
      next: {
        // default: 'track_structure_sizes',
        default: 'track_roles'
      },
      wildcard: {
        label: { fr: "Je préfère compléter mes informations manuellement" },
        next: {
          default: 'track_structure_sizes',
        }
      }
    }
  ]
}