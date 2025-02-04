import { Color, ThemeId, ThemeType } from '@/types'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { ProjectType } from '@tee/data'
import { ComputedRef } from 'vue'
import { useFiltersStore } from '@/stores/filters'

export class Theme {
  static themes: ThemeType[] = [
    {
      id: ThemeId.Energy,
      title: 'Énergie',
      tagLabel: '⚡️ énergie',
      image: '/images/thematique/thematique-energie.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Building,
      title: 'Construction & rénovation',
      tagLabel: '🏢 rénovation',
      image: '/images/thematique/thematique-batiments.svg',
      color: Color.purple
    },
    {
      id: ThemeId.Mobility,
      title: 'Mobilité',
      tagLabel: '🚲 mobilité',
      image: '/images/thematique/thematique-mobilite.svg',
      color: Color.green
    },
    {
      id: ThemeId.Water,
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      image: '/images/thematique/thematique-eau.svg',
      color: Color.blueFrance
    },
    {
      id: ThemeId.EcoDesign,
      title: 'Éco-conception',
      tagLabel: '🔁 écoconception',
      image: '/images/thematique/thematique-eco-conception.svg',
      color: Color.green
    },
    {
      id: ThemeId.Waste,
      title: 'Déchets & réemploi',
      tagLabel: '🗑 déchets',
      image: '/images/thematique/thematique-dechets.svg',
      color: Color.red
    },
    {
      id: ThemeId.RH,
      title: 'Ressources humaines',
      tagLabel: '🧑‍🎓 RH',
      image: '/images/thematique/thematique-ressources-humaines.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Environmental,
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      image: '/images/thematique/thematique-strategie.svg',
      color: Color.purple
    },
    {
      id: ThemeId.Biodiversity,
      title: 'Biodiversité',
      tagLabel: '🐝 biodiversité',
      image: '/images/thematique/thematique-biodiversite.svg',
      color: Color.green
    }
  ]

  static getById(id: ThemeId | undefined) {
    return this.themes.find((theme) => theme.id === id)
  }

  static getTitleById(themeId: ThemeId) {
    return this.getById(themeId)?.title ?? ''
  }

  static getImageById(themeId: ThemeId) {
    return this.getById(themeId)?.image ?? ''
  }

  static getColorById(themeId: ThemeId) {
    return this.getById(themeId)?.color ?? ''
  }

  static getTags(): ThemeType[] {
    const tags = []

    UsedTrack.hasEnergyTheme() ? tags.push(this.getById(ThemeId.Energy) as ThemeType) : undefined
    UsedTrack.hasBuildingProperty() ? tags.push(this.getById(ThemeId.Building) as ThemeType) : undefined
    UsedTrack.hasMobilityTheme() ? tags.push(this.getById(ThemeId.Mobility) as ThemeType) : undefined
    UsedTrack.hasWaterTheme() ? tags.push(this.getById(ThemeId.Water) as ThemeType) : undefined
    UsedTrack.hasEcoDesignTheme() ? tags.push(this.getById(ThemeId.EcoDesign) as ThemeType) : undefined
    UsedTrack.hasWasteTheme() ? tags.push(this.getById(ThemeId.Waste) as ThemeType) : undefined
    tags.push(this.getById(ThemeId.RH) as ThemeType)
    UsedTrack.hasEnvironmentalImpactTheme() ? tags.push(this.getById(ThemeId.Environmental) as ThemeType) : undefined

    return tags
  }

  static isTheme(theme: ThemeId | ''): theme is ThemeId {
    return theme !== ''
  }

  static getPriorityProjects(projects: ProjectType[] | undefined) {
    const sortedProjects = (projects as unknown as ProjectType[]).sort((a, b) => a.priority - b.priority)
    return { projects: sortedProjects.slice(0, 3), moreThanThree: sortedProjects.length > 3 }
  }

  static getThemeFromSelectedTheme(): ComputedRef<ThemeId | undefined> {
    return computed(() => {
      return useFiltersStore().hasThemeTypeSelected() ? (useFiltersStore().getThemeTypeSelected() as ThemeId) : undefined
    })
  }

  static getThemeFromSelectedOrPriorityTheme(): ComputedRef<ThemeId | undefined> {
    return computed(() => {
      return useFiltersStore().hasThemeTypeSelected()
        ? (useFiltersStore().getThemeTypeSelected() as ThemeId)
        : (UsedTrack.getPriorityTheme() ?? undefined)
    })
  }
}
