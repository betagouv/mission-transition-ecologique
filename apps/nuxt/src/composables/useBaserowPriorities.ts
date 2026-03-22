import type { BaserowProject, ProjectRow, HistoryEntry } from '~/types/baserow'

const getTheme = (project: BaserowProject): string => {
  const theme = project['Thématique principale']
  if (!theme) return 'N/A'
  if (Array.isArray(theme)) return theme[0]?.value || 'N/A'
  return theme
}

export const useBaserowPriorities = (selectedNaf: Ref<string>) => {
  const projects = ref<BaserowProject[]>([])
  // Snapshot des valeurs avant modification — sert à filtrer les projets changés et à renseigner l'historique
  const originalProjects = ref<Map<number, { Prio: number | string; 'Prios spécifiques': string }>>(new Map())
  const history = ref<HistoryEntry[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')
  const hasChanges = ref(false)

  const getPriority = (project: BaserowProject): number => {
    const naf = selectedNaf.value
    if (!naf) {
      const prio = parseFloat(project['Prio'] as string)
      return isNaN(prio) ? 9999 : prio
    }
    const priosSpec = project['Prios spécifiques'] || ''
    const regex = new RegExp(`(?:^|\\s)${naf.replace(/\./g, '\\.')}:([0-9]+\\.?[0-9]*)(?:\\s|$)`)
    const match = priosSpec.match(regex)
    if (match) return parseFloat(match[1])
    const globalPrio = parseFloat(project['Prio'] as string)
    return isNaN(globalPrio) ? 9999 : globalPrio
  }

  const sortedProjects = computed<ProjectRow[]>(() =>
    [...projects.value]
      .sort((a, b) => getPriority(a) - getPriority(b))
      .map((p) => ({ ...p, currentPriority: getPriority(p), theme: getTheme(p) }))
  )

  const loadHistory = async () => {
    try {
      const data = await $fetch<HistoryEntry[]>('/api/projects/priorities/history')
      history.value = data.slice().reverse()
    } catch {
      // Non bloquant : l'historique est facultatif
    }
  }

  const refresh = async () => {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    hasChanges.value = false
    try {
      const data = await $fetch<BaserowProject[]>('/api/projects/priorities')
      projects.value = Array.isArray(data) ? data : []
      // Capture l'état initial pour comparer lors de la sauvegarde
      originalProjects.value = new Map(
        projects.value.map((p) => [p.id, { 'Prio': p['Prio'] ?? 9999, 'Prios spécifiques': p['Prios spécifiques'] ?? '' }])
      )
    } catch {
      errorMessage.value = 'Erreur lors du chargement des projets'
    } finally {
      loading.value = false
    }
  }

  const updatePriority = (projectId: number, newVal: string) => {
    const value = parseFloat(newVal)
    if (isNaN(value) || value < 0) return
    const project = projects.value.find((p) => p.id === projectId)
    if (!project) return
    hasChanges.value = true
    errorMessage.value = ''
    successMessage.value = ''
    const naf = selectedNaf.value
    if (!naf) {
      project['Prio'] = value
    } else {
      const priosSpec = project['Prios spécifiques'] || ''
      const priosArray = priosSpec.trim() ? priosSpec.trim().split(/\s+/) : []
      const prefix = `${naf}:`
      const existingIndex = priosArray.findIndex((p) => p.startsWith(prefix))
      if (existingIndex !== -1) {
        priosArray[existingIndex] = `${prefix}${value}`
      } else {
        priosArray.push(`${prefix}${value}`)
      }
      project['Prios spécifiques'] = priosArray.join(' ')
    }
  }

  const saveChanges = async () => {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
      // Seuls les projets réellement modifiés sont envoyés (comparaison avec le snapshot d'origine)
      const updates = projects.value
        .filter((p) => {
          const orig = originalProjects.value.get(p.id)
          if (!orig) return false
          const prioChanged = parseFloat(p['Prio'] as string) !== parseFloat(orig['Prio'] as string)
          const priosSpecChanged = (p['Prios spécifiques'] || '') !== (orig['Prios spécifiques'] || '')
          return prioChanged || priosSpecChanged
        })
        .map((p) => {
          const orig = originalProjects.value.get(p.id)
          return {
            id: p.id,
            titre: p.Titre || p.title || p.slug || '',
            oldPrio: parseFloat(orig?.['Prio'] as string) || undefined,
            Prio: parseFloat(p['Prio'] as string) || undefined,
            oldPriosSpec: orig?.['Prios spécifiques'] ?? '',
            'Prios spécifiques': p['Prios spécifiques'] || ''
          }
        })
      await $fetch('/api/projects/priorities', { method: 'PATCH', body: { updates, nafCode: selectedNaf.value } })
      successMessage.value = 'Modifications enregistrées avec succès !'
      hasChanges.value = false
      await loadHistory()
      setTimeout(() => { successMessage.value = ''; refresh() }, 1500)
    } catch {
      errorMessage.value = "Erreur lors de l'enregistrement"
    } finally {
      saving.value = false
    }
  }

  return { loading, saving, hasChanges, successMessage, errorMessage, sortedProjects, updatePriority, saveChanges, refresh, history, loadHistory }
}
