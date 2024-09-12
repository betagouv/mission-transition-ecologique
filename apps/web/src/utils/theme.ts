import { Color, Objective, PublicodeObjective, PublicodesKeys, ThemeId, ThemeType } from '@/types'
import UsedTrack from '@/utils/track/usedTrack'
import { Project } from '@tee/data'

export class Theme {
  static themes: ThemeType[] = [
    {
      id: ThemeId.Energy,
      title: 'Énergie',
      tagLabel: '⚡️ énergie',
      value: Objective.EnergyPerformance,
      image: '/images/thematique/thematique-energie.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Building,
      title: 'Construction & rénovation',
      tagLabel: '🏢 rénovation',
      value: Objective.BuildingRenovation,
      image: '/images/thematique/thematique-batiments.svg',
      color: Color.purple,
      titleColor: Color.white
    },
    {
      id: ThemeId.Mobility,
      title: 'Mobilité',
      tagLabel: '🚲 mobilité',
      value: Objective.SustainableMobility,
      image: '/images/thematique/thematique-mobilite.svg',
      color: Color.green
    },
    {
      id: ThemeId.Water,
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      value: Objective.WaterConsumption,
      image: '/images/thematique/thematique-eau.svg',
      color: Color.blueFrance,
      titleColor: Color.white
    },
    {
      id: ThemeId.EcoDesign,
      title: 'Éco-conception',
      tagLabel: '🔁 écoconception',
      value: Objective.EcoDesign,
      image: '/images/thematique/thematique-eco-conception.svg',
      color: Color.green
    },
    {
      id: ThemeId.Waste,
      title: 'Déchets & réemploi',
      tagLabel: '🗑 déchets',
      value: Objective.WasteManagement,
      image: '/images/thematique/thematique-dechets.svg',
      color: Color.red
    },
    {
      id: ThemeId.RH,
      title: 'Ressources humaines',
      tagLabel: '🧑‍🎓 RH',
      value: Objective.TrainOrRecruit,
      image: '/images/thematique/thematique-ressources-humaines.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Environmental,
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      value: Objective.EnvironmentalImpact,
      image: '/images/thematique/thematique-strategie.svg',
      color: Color.purple,
      titleColor: Color.white
    }
  ]

  static getById(id: ThemeId | undefined) {
    return this.themes.find((theme) => theme.id === id)
  }

  static getByValue(value: Objective | undefined) {
    return this.themes.find((theme) => theme.value === value)
  }

  static getObjectiveByValue(value: Objective) {
    return this.themes.find((theme) => theme.value === value)?.value
  }

  static getTitleByValue(objective: Objective) {
    return this.getByValue(objective)?.title ?? ''
  }

  static getImageByValue(objective: Objective) {
    return this.getByValue(objective)?.image ?? ''
  }

  static getColorByValue(objective: Objective) {
    return this.getByValue(objective)?.color ?? ''
  }

  static getTags(): ThemeType[] {
    const tags = []

    if (UsedTrack.isNoSpecificGoal()) {
      UsedTrack.isEnergyObjective() ? tags.push(this.getByValue(Objective.EnergyPerformance) as ThemeType) : undefined
      tags.push(this.getByValue(Objective.BuildingRenovation) as ThemeType)
      UsedTrack.isMobilityObjective() ? tags.push(this.getByValue(Objective.SustainableMobility) as ThemeType) : undefined
      UsedTrack.isWaterObjective() ? tags.push(this.getByValue(Objective.WaterConsumption) as ThemeType) : undefined
      UsedTrack.isEcoDesignObjective() ? tags.push(this.getByValue(Objective.EcoDesign) as ThemeType) : undefined
      UsedTrack.isWasteObjective() ? tags.push(this.getByValue(Objective.WasteManagement) as ThemeType) : undefined
      tags.push(this.getByValue(Objective.TrainOrRecruit) as ThemeType)
      UsedTrack.isEnvironmentalImpactObjective() ? tags.push(this.getByValue(Objective.EnvironmentalImpact) as ThemeType) : undefined

      return tags
    }

    tags.push(...this.themes)

    return tags
  }

  static isObjective(objective: Objective | ''): objective is Objective {
    return objective !== ''
  }

  static getPriorityProjects(projects: Project[] | undefined) {
    const sortedProjects = (projects as unknown as Project[]).sort((a, b) => a.priority - b.priority)
    return { projects: sortedProjects.slice(0, 3), moreThanThree: sortedProjects.length > 3 }
  }

  static getPublicodeObjectiveByObjective(objective: Objective | undefined): PublicodeObjective | undefined {
    const key = Object.keys(PublicodeObjective).find(
      (key) => PublicodeObjective[key as keyof typeof PublicodeObjective] === ((PublicodesKeys.Goal + objective) as PublicodeObjective)
    ) as keyof typeof PublicodeObjective | undefined

    if (!key) {
      return undefined
    }

    return PublicodeObjective[key]
  }
}
