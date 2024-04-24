import { PublicodeObjective } from '@tee/common/src/questionnaire/types'

export default class Objective {
  static objectives: { title: string; tagLabel: string; value: PublicodeObjective; image: string; color: string }[] = [
    {
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      value: PublicodeObjective.EnvironmentalImpact,
      image: '/images/thematique/thematique-strategie.svg',
      color: 'blue'
    },
    {
      title: 'Économies d’énergie',
      tagLabel: '⚡️ énergie',
      value: PublicodeObjective.EnergyPerformance,
      image: '/images/thematique/thematique-energie.svg',
      color: 'yellow'
    },
    {
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      value: PublicodeObjective.WaterConsumption,
      image: '/images/thematique/thematique-eau.svg',
      color: 'blue'
    },
    {
      title: 'Construction & rénovation',
      tagLabel: '🏢 bâtiment',
      value: PublicodeObjective.BuildingRenovation,
      image: '/images/thematique/thematique-batiments.svg',
      color: 'red'
    },
    {
      title: 'Mobilité',
      tagLabel: '🚲 mobilité',
      value: PublicodeObjective.SustainableMobility,
      image: '/images/thematique/thematique-mobilite.svg',
      color: 'green'
    },
    {
      title: 'Déchets & réemploi',
      tagLabel: '🗑 déchets',
      value: PublicodeObjective.WasteManagement,
      image: '/images/thematique/thematique-dechets.svg',
      color: 'red'
    },
    {
      title: 'Éco-conception',
      tagLabel: '🔁 écoconception',
      value: PublicodeObjective.EcoDesign,
      image: '/images/thematique/thematique-strategie.svg',
      color: 'green'
    },
    {
      title: 'Ressources humaines',
      tagLabel: '🧑‍🎓 RH',
      value: PublicodeObjective.TrainOrRecruit,
      image: '/images/thematique/thematique-strategie.svg',
      color: 'yellow'
    }
  ]

  static getObjective(publicodeObjective: PublicodeObjective) {
    return this.objectives.find((objective) => objective.value === publicodeObjective)
  }

  static getTitleByObjective(objective: PublicodeObjective) {
    return this.getObjective(objective)?.title || ''
  }

  static getImageByObjective(objective: PublicodeObjective) {
    return this.getObjective(objective)?.image || ''
  }

  static getColorByObjective(objective: PublicodeObjective) {
    return this.getObjective(objective)?.color || ''
  }

  static getTags() {
    return [
      {
        tagLabel: 'Tous',
        value: ''
      },
      ...this.objectives
    ]
  }
}
