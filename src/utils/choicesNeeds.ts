export const needs = {
  interface: {
    component: 'cardChoices',
  },
  choices: [
    {
      value: 'needs.starting',
      label: { fr: "Je débute, je visite, je fais mes premiers pas" },
      hint: { fr: "Obtenez rapidement des premiers conseils, à travers notre outil ou avec un conseiller, afin d’initier votre transition écologique" },
      next: {
        default: 'sectors'
      }
    },
    {
      value: 'needs.advices',
      label: { fr: "Je veux un conseil, une étude, un audit" },
      hint: { fr: "Faites des économies, cadrez un projet avec un accompagnement, un expert, un diagnostic adapté à votre situation" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'needs.financing',
      label: { fr: "J’ai un projet, un besoin de financement" },
      hint: { fr: "Obtenez un aide technique ou financière pour vos investissements ou un projet ayant un impact environnemental" },
      next: {
        default: 'results'
      }
    }
  ]
}
