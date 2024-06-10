import { Theme as ThemeType } from './types'
import { Color } from '@tee/web/src/types/color'
import { Objective } from '../questionnaire/types/types'
import { projects } from '../project/mockData'
import { Project, ProjectId } from '../project/types'
export default class Theme {
  static themes: ThemeType[] = [
    {
      id: 'environmental',
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      value: Objective.EnvironmentalImpact,
      image: '/images/thematique/thematique-strategie.svg',
      color: Color.blue,
      highlightProjects: [1, 2]
    },
    {
      id: 'energy',
      title: 'Économies d’énergie',
      tagLabel: '⚡️ énergie',
      value: Objective.EnergyPerformance,
      image: '/images/thematique/thematique-energie.svg',
      color: Color.yellow,
      highlightProjects: [1, 2]
    },
    {
      id: 'water',
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      value: Objective.WaterConsumption,
      image: '/images/thematique/thematique-eau.svg',
      color: Color.blueLight,
      highlightProjects: [1, 2]
    },
    {
      id: 'building',
      title: 'Construction & rénovation',
      tagLabel: '🏢 bâtiment',
      value: Objective.BuildingRenovation,
      image: '/images/thematique/thematique-batiments.svg',
      color: Color.blue,
      highlightProjects: [1, 2]
    },
    {
      id: 'mobility',
      title: 'Mobilité',
      tagLabel: '🚲 mobilité',
      value: Objective.SustainableMobility,
      image: '/images/thematique/thematique-mobilite.svg',
      color: Color.green,
      highlightProjects: [1, 2]
    },
    {
      id: 'waste',
      title: 'Déchets & réemploi',
      tagLabel: '🗑 déchets',
      value: Objective.WasteManagement,
      image: '/images/thematique/thematique-dechets.svg',
      color: Color.red,
      highlightProjects: [1, 2]
    },
    {
      id: 'eco-design',
      title: 'Éco-conception',
      tagLabel: '🔁 écoconception',
      value: Objective.EcoDesign,
      image: '/images/thematique/thematique-eco-conception.svg',
      color: Color.green,
      highlightProjects: [1, 2]
    },
    {
      id: 'rh',
      title: 'Ressources humaines',
      tagLabel: '🧑‍🎓 RH',
      value: Objective.TrainOrRecruit,
      image: '/images/thematique/thematique-ressources-humaines.svg',
      color: Color.yellow,
      highlightProjects: [1, 2]
    }
  ]

  static getByValue(value: Objective) {
    return this.themes.find((theme) => theme.value === value)
  }

  static getHighlightProjects(highlightProjects: ProjectId[]) {
    return highlightProjects.map((projectId: ProjectId) => projects.find((project: Project) => project.id === projectId))
  }
}
