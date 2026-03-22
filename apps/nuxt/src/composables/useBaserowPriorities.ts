import type { BaserowProject, ProjectRow } from '~/types/baserow'

const getTheme = (project: BaserowProject): string => {
  const theme = project['Thématique principale']
  if (!theme) return 'N/A'
  if (Array.isArray(theme)) return theme[0]?.value || 'N/A'
  return theme
}

export const useBaserowPriorities = (selectedNaf: Ref<string>) => {
  const projects = ref<BaserowProject[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')
  const modifiedIds = ref(new Set<number>())

  const hasChanges = computed(() => modifiedIds.value.size > 0)

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

  const refresh = async () => {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    modifiedIds.value = new Set()
    try {
      const data = await $fetch<BaserowProject[]>('/api/projects/priorities')
      projects.value = Array.isArray(data) ? data : []
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

    modifiedIds.value = new Set([...modifiedIds.value, projectId])
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
      const modifiedProjects = projects.value.filter((p) => modifiedIds.value.has(p.id))
      const updates = modifiedProjects.map((p) => ({
        id: p.id,
        Prio: typeof p['Prio'] === 'number' ? p['Prio'] : parseFloat(p['Prio'] as string) || undefined,
        'Prios spécifiques': p['Prios spécifiques'] || ''
      }))
      await $fetch('/api/projects/priorities', {
        method: 'PATCH',
        body: { updates, nafCode: selectedNaf.value }
      })
      successMessage.value = 'Modifications enregistrées avec succès !'
      modifiedIds.value = new Set()
      setTimeout(() => {
        successMessage.value = ''
        refresh()
      }, 1500)
    } catch {
      errorMessage.value = "Erreur lors de l'enregistrement"
    } finally {
      saving.value = false
    }
  }

  return { loading, saving, hasChanges, successMessage, errorMessage, sortedProjects, updatePriority, saveChanges, refresh }
}
