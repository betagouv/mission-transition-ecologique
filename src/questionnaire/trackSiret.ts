export const siret = {
  id: 'track_siret',
  category: 'entreprise',
  title: { fr: 'Mon SIRET' },
  label: { fr: 'Quelle est votre entreprise ?' },
  info: { fr: "Cette information permet de filtrer les accompagnements en fonction de la taille de votre entreprise, de votre secteur d’activité et de votre zone géographique." },
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
      label: { fr: "Indiquez votre numéro de SIRET" },
      placeholder: { fr: 'Nom, adresse, SIRET/SIREN...' },
      postInput: { fr: 'Vous ne retrouvez pas votre SIRET ? <a href="https://annuaire-entreprises.data.gouv.fr/" target="_blank">Cliquez ici</a>' },
      // required: false,
      callbacks: [
        {
          disabled: false,
          help: 'Get entreprise data from its SIRET number',
          helpDocumentation: 'https://tee-backend-test.osc-fr1.scalingo.io/api/docs',
          action: 'getSiretInfos',
          url: 'https://tee-backend-test.osc-fr1.scalingo.io/api/insee/get_by_siret',
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          dataStructure: {
            siret: ''
          },
          dataMapping: [
            {
              from: 'formData',
              id: 'inputValue',
              dataField: 'siret',
            }
          ],
          resultsMapping: [
            {
              respFields: [
                'data.etablissement.uniteLegale.denominationUniteLegale',
                'data.etablissement.siret'
              ],
              // label: 'entité',
              class: 'fr-mb-3v',
              sep: ' - SIRET ',
              style: 'font-weight: bold;'
            },
            {
              respFields: [
                'data.etablissement.adresseEtablissement.numeroVoieEtablissement',
                'data.etablissement.adresseEtablissement.typeVoieEtablissement',
                'data.etablissement.adresseEtablissement.libelleVoieEtablissement',
                'data.etablissement.adresseEtablissement.codePostalEtablissement',
                'data.etablissement.adresseEtablissement.libelleCommuneEtablissement',
              ],
              // label: 'Adresse',
              icon: 'fr-icon-map-pin-2-line'
            },
            {
              respFields: ['data.etablissement.uniteLegale.categorieEntreprise'],
              label: 'Catégorie',
              icon: 'fr-icon-parent-line'
            },
            {
              respFields: ['data.etablissement.uniteLegale.dateCreationUniteLegale'],
              label: 'Date de création',
              prefix: 'Création le ',
              icon: 'fr-icon-time-line'
            },
            {
              respFields: ['data.etablissement.uniteLegale.activitePrincipaleUniteLegale'],
              label: 'Code NAF',
              icon: 'fr-icon-briefcase-line'
            },
            // {
            //   respFields: ['data.etablissement.siret'],
            //   label: 'SIRET',
            //   icon: 'fr-icon-building-fill'
            // },
            // {
            //   respFields: ['data.etablissement.siren'],
            //   label: 'SIRET',
            //   icon: 'fr-icon-building-fill'
            // },
            // {
            //   respFields: ['data.etablissement.nic'],
            //   label: 'NIC',
            //   icon: 'fr-icon-building-fill'
            // },
          ]
        }
      ],
      next: {
        default: 'track_structure_sizes'
      }
    }
  ]
}