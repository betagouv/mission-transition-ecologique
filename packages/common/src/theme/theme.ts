import { PublicodeObjective } from '../questionnaire/types/types'
import { Theme as ThemeType } from './types'
import { Color } from '@tee/web/src/types/color'

export default class Theme {
  static themes: ThemeType[] = [
    {
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      value: PublicodeObjective.EnvironmentalImpact,
      image: '/images/thematique/thematique-strategie.svg',
      color: Color.blue
    },
    {
      title: 'Économies d’énergie',
      tagLabel: '⚡️ énergie',
      value: PublicodeObjective.EnergyPerformance,
      image: '/images/thematique/thematique-energie.svg',
      color: Color.yellow
    },
    {
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      value: PublicodeObjective.WaterConsumption,
      image: '/images/thematique/thematique-eau.svg',
      color: Color.blueLight
    },
    {
      title: 'Construction & rénovation',
      tagLabel: '🏢 bâtiment',
      value: PublicodeObjective.BuildingRenovation,
      image: '/images/thematique/thematique-batiments.svg',
      color: Color.blue
    },
    {
      title: 'Mobilité',
      tagLabel: '🚲 mobilité',
      value: PublicodeObjective.SustainableMobility,
      image: '/images/thematique/thematique-mobilite.svg',
      color: Color.green
    },
    {
      title: 'Déchets & réemploi',
      tagLabel: '🗑 déchets',
      value: PublicodeObjective.WasteManagement,
      image: '/images/thematique/thematique-dechets.svg',
      color: Color.red
    },
    {
      title: 'Éco-conception',
      tagLabel: '🔁 écoconception',
      value: PublicodeObjective.EcoDesign,
      image: '/images/thematique/thematique-eco-conception.svg',
      color: Color.green
    },
    {
      title: 'Ressources humaines',
      tagLabel: '🧑‍🎓 RH',
      value: PublicodeObjective.TrainOrRecruit,
      image: '/images/thematique/thematique-ressources-humaines.svg',
      color: Color.yellow
    }
  ]

  static getByValue(value: PublicodeObjective) {
    return this.themes.find((theme) => theme.value === value)
  }
}
