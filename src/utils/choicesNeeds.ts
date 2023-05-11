export const needs = {
  id: 'project_needs',
  label: { fr: 'Votre besoin' },
  interface: {
    component: 'cards',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'project_needs.starting',
      label: { fr: "Je débute, je visite, je fais mes premiers pas" },
      hint: { fr: "Obtenez rapidement des premiers conseils, à travers notre outil ou avec un conseiller, afin d’initier votre transition écologique" },
      next: {
        default: 'project_sectors'
      }
    },
    {
      value: 'project_needs.advices',
      label: { fr: "Je veux un conseil, une étude, un audit" },
      hint: { fr: "Faites des économies, cadrez un projet avec un accompagnement, un expert, un diagnostic adapté à votre situation" },
      next: {
        default: 'project_status'
      }
    },
    {
      value: 'project_needs.financing',
      label: { fr: "J’ai un projet, un besoin de financement" },
      hint: { fr: "Obtenez un aide technique ou financière pour vos investissements ou un projet ayant un impact environnemental" },
      next: {
        default: 'results'
      }
    }
  ]
}
