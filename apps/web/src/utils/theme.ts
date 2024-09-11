import { Color, Objective, ThemeId, ThemeType } from '@/types'
import UsedTrack from '@/utils/track/usedTrack'
import { Project } from '@tee/data'

export class Theme {
  static themes: ThemeType[] = [
    {
      id: ThemeId.Environmental,
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      value: Objective.EnvironmentalImpact,
      image: '/images/thematique/thematique-strategie.svg',
      color: Color.blue
    },
    {
      id: ThemeId.Energy,
      title: 'Énergie',
      tagLabel: '⚡️ énergie',
      value: Objective.EnergyPerformance,
      image: '/images/thematique/thematique-energie.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Water,
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      value: Objective.WaterConsumption,
      image: '/images/thematique/thematique-eau.svg',
      color: Color.blueFrance
    },
    {
      id: ThemeId.Building,
      title: 'Construction & rénovation',
      tagLabel: '🏢 rénovation',
      value: Objective.BuildingRenovation,
      image: '/images/thematique/thematique-batiments.svg',
      color: Color.blue
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
    }
  ]

  static getById(id: ThemeId | undefined) {
    return this.themes.find((theme) => theme.id === id)
  }

  static getByValue(value: Objective | undefined) {
    return this.themes.find((theme) => theme.value === value)
  }

  static getThemeByValue(value: Objective) {
    return this.themes.find((theme) => theme.value === value)?.value
  }

  static getTitleByValue(theme: Objective) {
    return this.getByValue(theme)?.title ?? ''
  }

  static getImageByValue(theme: Objective) {
    return this.getByValue(theme)?.image ?? ''
  }

  static getColorByValue(theme: Objective) {
    return this.getByValue(theme)?.color ?? ''
  }

  static getTags(): ThemeType[] {
    const tags = []

    if (UsedTrack.isNoSpecificGoal()) {
      UsedTrack.isEnvironmentalImpactTheme() ? tags.push(this.getByValue(Objective.EnvironmentalImpact) as ThemeType) : undefined
      UsedTrack.isEcoDesignTheme() ? tags.push(this.getByValue(Objective.EcoDesign) as ThemeType) : undefined
      UsedTrack.isEnergyTheme() ? tags.push(this.getByValue(Objective.EnergyPerformance) as ThemeType) : undefined
      UsedTrack.isWasteTheme() ? tags.push(this.getByValue(Objective.WasteManagement) as ThemeType) : undefined
      UsedTrack.isWaterTheme() ? tags.push(this.getByValue(Objective.WaterConsumption) as ThemeType) : undefined
      UsedTrack.isMobilityTheme() ? tags.push(this.getByValue(Objective.SustainableMobility) as ThemeType) : undefined
      tags.push(this.getByValue(Objective.TrainOrRecruit) as ThemeType)

      return tags
    }

    tags.push(...this.themes)

    return tags
  }

  static isTheme(theme: Objective | ''): theme is Objective {
    return theme !== ''
  }

  static getPriorityProjects(projects: Project[] | undefined) {
    const sortedProjects = (projects as unknown as Project[]).sort((a, b) => a.priority - b.priority)
    return { projects: sortedProjects.slice(0, 3), moreThanThree: sortedProjects.length > 3 }
  }
}
