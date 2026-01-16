import { Color, ThemeId, ThemeType, ProjectType } from '@/types'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { ComputedRef } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import Navigation from './navigation'

export class Theme {
  static themes: ThemeType[] = [
    {
      id: ThemeId.Energy,
      title: 'Énergie',
      tagLabel: '⚡️ énergie',
      slug: 'energie',
      image: '/images/thematique/thematique-energie.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Building,
      title: 'Construction & rénovation',
      tagLabel: '🏢 rénovation',
      slug: 'construction-et-renovation',
      image: '/images/thematique/thematique-batiments.svg',
      color: Color.purple
    },
    {
      id: ThemeId.Mobility,
      title: 'Mobilité',
      tagLabel: '🚲 mobilité',
      slug: 'mobilite',
      image: '/images/thematique/thematique-mobilite.svg',
      color: Color.green
    },
    {
      id: ThemeId.Water,
      title: 'Économies d’eau',
      tagLabel: '💧 eau',
      slug: 'economies-eau',
      image: '/images/thematique/thematique-eau.svg',
      color: Color.blueFrance
    },
    {
      id: ThemeId.EcoDesign,
      title: 'Éco-conception',
      tagLabel: '🔁 écoconception',
      slug: 'eco-conception',
      image: '/images/thematique/thematique-eco-conception.svg',
      color: Color.green
    },
    {
      id: ThemeId.Waste,
      title: 'Déchets & réemploi',
      tagLabel: '🗑 déchets',
      slug: 'dechets-et-reemploi',
      image: '/images/thematique/thematique-dechets.svg',
      color: Color.red
    },
    {
      id: ThemeId.RH,
      title: 'Ressources humaines',
      tagLabel: '🧑‍🎓 RH',
      slug: 'ressources-humaines',
      image: '/images/thematique/thematique-ressources-humaines.svg',
      color: Color.yellow
    },
    {
      id: ThemeId.Environmental,
      title: 'Analyses environnementales',
      tagLabel: '🌱 analyses',
      slug: 'analyses-environnementales',
      image: '/images/thematique/thematique-strategie.svg',
      color: Color.purple
    },
    {
      id: ThemeId.Biodiversity,
      title: 'Biodiversité',
      tagLabel: '🐝 biodiversité',
      slug: 'biodiversite',
      image: '/images/thematique/thematique-biodiversite.svg',
      color: Color.green
    }
  ]

  static getById(id: ThemeId | undefined) {
    return this.themes.find((theme) => theme.id === id)
  }

  static getBySlug(slug: string) {
    return this.themes.find((theme) => theme.slug === slug)
  }

  static getIdBySlug(slug: string) {
    return this.getBySlug(slug)?.id
  }

  static getSlugById(themeId: ThemeId) {
    return this.getById(themeId)?.slug ?? ''
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
    const navigation = new Navigation()
    if (navigation.isCatalog() || navigation.isHomepage()) {
      tags.push(...this.themes)

      return tags
    }

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

  static isValidTheme(theme: string): boolean {
    return Object.values(ThemeId).includes(theme as ThemeId) || theme === ''
  }

  static getPriorityProjects(projects: ProjectType[]) {
    return { projects: projects.slice(0, 3), moreThanThree: projects.length > 3 }
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
