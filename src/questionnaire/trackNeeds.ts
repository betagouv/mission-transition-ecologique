export const needs = {
  id: 'track_needs',
  label: { fr: 'Votre besoin' },
  interface: {
    component: 'cards',
    columnWidth: 'auto',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      disabled: true,
      value: { project_needs: '*' },
      label: { fr: "Je souhaite tout voir d'un coup même si je n'y connais rien" },
      hint: { fr: "Oui, des fois on est juste très curieux... En vrai c'est pour tester mais faudra pas laisser ce bloc traîner quand on mettra en prod sinon les gens vont se foutre de notre gueule" },
      next: {
        default: 'track_results'
      }
    },
    {
      disabled: true,
      value: { project_needs: 'starting' },
      label: { fr: "Je débute, je visite, je fais mes premiers pas" },
      hint: { fr: "Obtenez rapidement des premiers conseils, à travers notre outil ou avec un conseiller, afin d’initier votre transition écologique" },
      next: {
        default: 'track_sectors'
      }
    },
    {
      value: { project_needs: 'advices' },
      label: { fr: "Je souhaite être conseillé pour réduire mon impact environnemental" },
      hint: { fr: "Faites des économies, cadrez un projet avec un accompagnement, un expert, un diagnostic adapté à votre situation" },
      next: {
        default: 'track_structure_sizes'
      }
    },
    {
      value: { project_needs: 'financing' },
      label: { fr: "J’ai un projet de transition écologique et je cherche un financement" },
      hint: { fr: "Obtenez une aide technique ou financière pour vos investissements ou un projet ayant un impact environnemental" },
      next: {
        default: 'track_structure_sizes'
      }
    },
    {
      value: { project_needs: '*' },
      label: { fr: "Je cherche juste à m'informer" },
      hint: { fr: "Faites une première recherche et découvrez les différentes offres" },
      next: {
        default: 'track_structure_sizes'
      }
    }
  ]
}
