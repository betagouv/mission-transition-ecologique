<template>
  <div class="fr-container fr-py-6w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1 class="fr-h2 fr-mb-4w">Gestion des priorités</h1>

        <div class="fr-select-group fr-p-4w fr-background-alt--blue-france fr-rounded-md">
          <label class="fr-label fr-text--bold" for="naf-select">Secteur d'activité (Code NAF)</label>
          <select id="naf-select" class="fr-select" v-model="selectedNaf">
            <option value="">-- Priorité Globale --</option>
            <optgroup label="Sections principales">
              <option v-for="section in mainSections" :key="section.code" :value="section.code">
                {{ section.code }} - {{ section.label }}
              </option>
            </optgroup>
            <optgroup label="Divisions (NIV2)">
              <option v-for="div in divisions" :key="div.NIV2" :value="div.NIV2">
                {{ div.NIV2 }} - {{ div.label_vf }}
              </option>
            </optgroup>
            <optgroup label="Codes détaillés (NIV5)">
              <option v-for="code in detailedCodes" :key="code.NIV5" :value="code.NIV5">
                {{ code.NIV5 }} - {{ code.label_vf }}
              </option>
            </optgroup>
          </select>
          <p v-if="selectedNaf && selectedNafLabel" class="fr-text--sm fr-mt-2w">
            {{ selectedNafLabel }}
          </p>
        </div>

        <div class="fr-mt-4w">
          <div class="fr-grid-row fr-grid-row--middle fr-mb-3w">
            <div class="fr-col">
              <span class="fr-badge fr-badge--sm fr-badge--info">
                {{ sortedProjects.length }} projets
              </span>
              <span v-if="selectedNaf" class="fr-ml-2w fr-text--sm">
                Code NAF : <strong>{{ selectedNaf }}</strong>
              </span>
            </div>
            <div v-if="hasChanges" class="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
              <button class="fr-btn"
                :class="saving ? 'fr-btn--tertiary-no-outline' : 'fr-background--blue-france fr-text--yellow'"
                @click="saveChanges" :disabled="saving">
                <span v-if="!saving" class="fr-icon-check-line fr-pr-1w" aria-hidden="true"></span>
                {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </button>
              <button class="fr-btn fr-btn--secondary" @click="refresh" :disabled="saving">
                Annuler
              </button>
            </div>
          </div>

          <!-- Message de succès -->
          <div v-if="successMessage" class="fr-alert fr-alert--success fr-mb-3w">
            <p class="fr-alert__title">{{ successMessage }}</p>
          </div>

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="fr-alert fr-alert--error fr-mb-3w">
            <p class="fr-alert__title">{{ errorMessage }}</p>
          </div>

          <div class="fr-table fr-table--bordered fr-table--no-caption">
            <table>
              <thead>
                <tr>
                  <th scope="col" class="col-drag"></th>
                  <th scope="col" style="width: 7rem">Priorité</th>
                  <th scope="col">Nom du projet</th>
                  <th scope="col">Thématique</th>
                  <th scope="col" style="width: 8rem">Prio globale</th>
                </tr>
              </thead>
              <tbody v-if="!loading">
                <tr v-for="(project, index) in sortedProjects" :key="project.id" draggable="true"
                  @dragstart="handleDragStart(index)" @dragover.prevent="handleDragOver(index)" @drop="handleDrop"
                  :class="{ 'is-dragging': draggingIndex === index }" class="project-row">
                  <td class="col-drag">
                    <div class="drag-bar">
                      <span></span><span></span><span></span>
                    </div>
                  </td>
                  <td>
                    <input type="number" class="fr-input fr-input--sm" :value="getPriority(project)"
                      @input="updatePriority(project, ($event.target as HTMLInputElement).value)" step="0.1" min="0" />
                  </td>
                  <td class="fr-text--bold">{{ project.title || project.Titre || project.Nom || project.slug }}</td>
                  <td>
                    <span class="fr-badge fr-badge--sm fr-badge--purple-glycine">
                      {{ project['Thématique principale'] || project.mainTheme || 'N/A' }}
                    </span>
                  </td>
                  <td class="fr-text--sm">{{ formatScore(project.priority?.default || project.Prio) }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="5" class="fr-text--center fr-py-4w">
                    Chargement des projets...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import nafCodesData from '../../../../../libs/data/static/nafMapping.json'

interface NafCode {
  tags: string[]
  tagsFr: string[]
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}

interface Project {
  id: number
  slug: string
  title?: string
  Titre?: string
  Nom?: string
  mainTheme?: string
  'Thématique principale'?: string
  Prio?: number
  '# Prio'?: number
  priority?: {
    default?: number
    [key: string]: number | undefined
  }
  'Prios spécifiques'?: string
}

// Charger le mapping NAF depuis le fichier local
const nafCodes = ref<NafCode[]>(nafCodesData as NafCode[])
const nafMapping = ref<Map<string, NafCode>>(new Map())

const selectedNaf = ref('')
const projects = ref<Project[]>([])
const loading = ref(false)
const saving = ref(false)
const hasChanges = ref(false)
const draggingIndex = ref<number | null>(null)
const successMessage = ref('')
const errorMessage = ref('')

// Sections principales (NIV1)
const mainSections = computed(() => {
  const sections = new Map<string, { code: string, label: string }>()
  nafCodes.value.forEach(code => {
    if (!sections.has(code.NIV1)) {
      const labels: Record<string, string> = {
        'A': 'Agriculture, sylviculture et pêche',
        'B': 'Industries extractives',
        'C': 'Industrie manufacturière',
        'D': 'Production et distribution d\'électricité, gaz',
        'E': 'Production et distribution d\'eau',
        'F': 'Construction',
        'G': 'Commerce',
        'H': 'Transports et entreposage',
        'I': 'Hébergement et restauration',
        'J': 'Information et communication',
        'K': 'Activités financières et d\'assurance',
        'L': 'Activités immobilières',
        'M': 'Activités spécialisées, scientifiques et techniques',
        'N': 'Activités de services administratifs et de soutien',
        'O': 'Administration publique',
        'P': 'Enseignement',
        'Q': 'Santé humaine et action sociale',
        'R': 'Arts, spectacles et activités récréatives',
        'S': 'Autres activités de services',
        'T': 'Activités des ménages',
        'U': 'Activités extra-territoriales'
      }
      sections.set(code.NIV1, {
        code: code.NIV1,
        label: labels[code.NIV1] || code.NIV1
      })
    }
  })
  return Array.from(sections.values()).sort((a, b) => a.code.localeCompare(b.code))
})

// Divisions (NIV2)
const divisions = computed(() => {
  const divs = new Map<string, NafCode>()
  nafCodes.value.forEach(code => {
    if (!divs.has(code.NIV2)) {
      divs.set(code.NIV2, code)
    }
  })
  return Array.from(divs.values()).sort((a, b) => a.NIV2.localeCompare(b.NIV2))
})

// Codes détaillés (NIV5) - tous les codes
const detailedCodes = computed(() => {
  return nafCodes.value.sort((a, b) => a.NIV5.localeCompare(b.NIV5))
})

// Label du NAF sélectionné
const selectedNafLabel = computed(() => {
  if (!selectedNaf.value) return ''
  const code = nafMapping.value.get(selectedNaf.value)
  return code ? code.label_vf : ''
})

// Formater le score pour l'affichage
const formatScore = (score: number | undefined): string => {
  if (score === undefined || score === null) return 'N/A'
  return score.toFixed(1)
}

// Récupérer la priorité d'un projet
const getPriority = (project: Project): number => {
  if (!selectedNaf.value) {
    // Mode priorité globale
    return project.Prio ?? project['# Prio'] ?? project.priority?.default ?? 9999
  }

  // Mode code NAF : chercher dans "Prios spécifiques"
  const priosSpec = project['Prios spécifiques'] || ''

// Regex pour matcher "CODE:NOMBRE"
  const regex = new RegExp(`(?:^|\\s)${selectedNaf.value.replace(/\./g, '\\.')}:([0-9]+\\.?[0-9]*)(?:\\s|$)`)
  const match = priosSpec.match(regex)

  if (match) {
    return parseFloat(match[1])
  }

  // Si pas trouvé, retourner la priorité par défaut
  return project.priority?.default ?? project.Prio ?? project['# Prio'] ?? 9999
}

// Projets triés par priorité
const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => {
    const prioA = getPriority(a)
    const prioB = getPriority(b)
    return prioA - prioB
  })
})

// Initialiser le mapping NAF
const initNafMapping = () => {
  nafCodes.value.forEach((code: NafCode) => {
    nafMapping.value.set(code.NIV5, code)
    nafMapping.value.set(code.NIV4, code)
    nafMapping.value.set(code.NIV3, code)
    nafMapping.value.set(code.NIV2, code)
    nafMapping.value.set(code.NIV1, code)
  })
}

// Charger les projets
const refresh = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const data: any = await $fetch('/api/projects')
    projects.value = Array.isArray(data) ? data : (data.results || [])
    hasChanges.value = false
  } catch (e) {
    errorMessage.value = 'Erreur lors du chargement des projets'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Mettre à jour la priorité d'un projet
const updatePriority = (project: Project, newVal: string) => {
  const value = parseFloat(newVal)

  if (isNaN(value) || value < 1) {
    return
  }

  hasChanges.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!selectedNaf.value) {
    // Mode priorité globale : mettre à jour "Prio"
    project.Prio = value
    if (project['# Prio'] !== undefined) {
      project['# Prio'] = value
    }
    if (project.priority) {
      project.priority.default = value
    }
  } else {
    // Mode code NAF : mettre à jour "Prios spécifiques"
    const priosSpec = project['Prios spécifiques'] || ''
    const priosArray = priosSpec.trim() ? priosSpec.trim().split(/\s+/) : []

    const prefix = `${selectedNaf.value}:`
    const existingIndex = priosArray.findIndex(p => p.startsWith(prefix))

    if (existingIndex !== -1) {
      // Remplacer la valeur existante
      priosArray[existingIndex] = `${prefix}${value}`
    } else {
      // Ajouter la nouvelle valeur
      priosArray.push(`${prefix}${value}`)
    }

    project['Prios spécifiques'] = priosArray.join(' ')
  }
}

// Drag & Drop
const handleDragStart = (index: number) => {
  draggingIndex.value = index
}

const handleDragOver = (index: number) => {
  if (draggingIndex.value === null || draggingIndex.value === index) return

  const list = [...sortedProjects.value]
  const draggedItem = list[draggingIndex.value]

  // Calculer le nouveau score en fonction de la position
  let newScore: number

  if (index === 0) {
    // Déplacer en première position : prendre un score inférieur au premier
    newScore = getPriority(list[0]) - 1
  } else if (index === list.length - 1) {
    // Déplacer en dernière position : prendre un score supérieur au dernier
    newScore = getPriority(list[list.length - 1]) + 1
  } else {
    // Insérer entre deux éléments : moyenne des scores
    const prevScore = getPriority(list[index - 1])
    const nextScore = getPriority(list[index])
    newScore = (prevScore + nextScore) / 2
  }

  updatePriority(draggedItem, newScore.toString())
  draggingIndex.value = index
  hasChanges.value = true
}

const handleDrop = () => {
  draggingIndex.value = null
}

// Sauvegarder les modifications
const saveChanges = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const updates = projects.value.map(p => ({
      id: p.id,
      'Prio': p.Prio ?? p['# Prio'],
      'Prios spécifiques': p['Prios spécifiques'] || ''
    }))

    await $fetch('/api/admin/projects/priorities', {
      method: 'PATCH',
      body: { updates, nafCode: selectedNaf.value }
    })

    successMessage.value = 'Modifications enregistrées avec succès !'
    hasChanges.value = false

    // Recharger après 1 seconde
    setTimeout(() => {
      successMessage.value = ''
      refresh()
    }, 1500)
  } catch (e) {
    errorMessage.value = 'Erreur lors de l\'enregistrement'
    console.error(e)
  } finally {
    saving.value = false
  }
}

// Charger au montage
onMounted(async () => {
  initNafMapping()
  await refresh()
})

// Recharger quand le NAF change
watch(selectedNaf, () => {
  errorMessage.value = ''
  successMessage.value = ''
})
</script>

<style scoped>
.fr-background-alt--blue-france {
  background-color: #f5f5fe;
}

.fr-rounded-md {
  border-radius: 0.25rem;
}

.project-row {
  background-color: white;
  transition: opacity 0.2s;
}

.project-row:hover {
  background-color: #f6f6f6;
}

.col-drag {
  width: 2rem;
  padding: 0 !important;
  vertical-align: middle;
}

.drag-bar {
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: grab;
  padding: 1.2rem 0.5rem;
  align-items: center;
}

.drag-bar:active {
  cursor: grabbing;
}

.drag-bar span {
  display: block;
  width: 14px;
  height: 2px;
  background-color: #000091;
  border-radius: 1px;
}

.is-dragging {
  opacity: 0.3;
  background-color: #eeeeee !important;
}

.fr-input--sm {
  text-align: center;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid #000091;
  font-weight: 600;
  width: 7rem;
}

.fr-input--sm:focus {
  outline: none;
  border-bottom-color: #0063cb;
}
</style>