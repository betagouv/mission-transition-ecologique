import { PublicodeObjective, Objective as ObjectiveEnum, PublicodesKeys, ObjectiveType, Color } from '@/types'
import UsedTrack from '@/utils/track/usedTrack'

export default class Objective {
  static objectives: ObjectiveType[] = [
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

  static getObjective(publicodeObjective: PublicodeObjective) {
    return this.objectives.find((objective) => objective.value === publicodeObjective)
  }

  static getTitleByObjective(objective: PublicodeObjective) {
    return this.getObjective(objective)?.title ?? ''
  }

  static getImageByObjective(objective: PublicodeObjective) {
    return this.getObjective(objective)?.image ?? ''
  }

  static getColorByObjective(objective: PublicodeObjective) {
    return this.getObjective(objective)?.color ?? ''
  }

  static getTags(): ObjectiveType[] {
    const tags = []

    if (UsedTrack.isNoSpecificGoal()) {
      UsedTrack.isEnvironmentalImpactObjective()
        ? tags.push(this.getObjective(PublicodeObjective.EnvironmentalImpact) as ObjectiveType)
        : undefined
      UsedTrack.isEcoDesignObjective() ? tags.push(this.getObjective(PublicodeObjective.EcoDesign) as ObjectiveType) : undefined
      UsedTrack.isEnergyObjective() ? tags.push(this.getObjective(PublicodeObjective.EnergyPerformance) as ObjectiveType) : undefined
      UsedTrack.isWasteObjective() ? tags.push(this.getObjective(PublicodeObjective.WasteManagement) as ObjectiveType) : undefined
      UsedTrack.isWaterObjective() ? tags.push(this.getObjective(PublicodeObjective.WaterConsumption) as ObjectiveType) : undefined
      UsedTrack.isMobilityObjective() ? tags.push(this.getObjective(PublicodeObjective.SustainableMobility) as ObjectiveType) : undefined

      return tags
    }

    tags.push(...this.objectives)
    return tags
  }

  static isPublicodeObjective(objective: PublicodeObjective | ''): objective is PublicodeObjective {
    return objective !== ''
  }

  static getPublicodeObjectiveByObjective(objective: ObjectiveEnum): PublicodeObjective | undefined {
    const key = Object.keys(PublicodeObjective).find(
      (key) => PublicodeObjective[key as keyof typeof PublicodeObjective] === ((PublicodesKeys.Goal + objective) as PublicodeObjective)
    ) as keyof typeof PublicodeObjective | undefined

    if (!key) {
      return undefined
    }

    return PublicodeObjective[key]
  }
}
