<template>
  <div class="fr-container fr-py-6w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1 class="fr-h2 fr-mb-4w">Gestion des priorités</h1>

        <!-- Sélecteur NAF en fil d'ariane -->
        <div class="fr-p-4w fr-mb-4w naf-selector">
          <p class="fr-label fr-text--bold fr-mb-2w">Filtrer par secteur d'activité (Code NAF)</p>

          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
            <!-- Niveau 1 : Section -->
            <div class="fr-col-12 fr-col-md-4">
              <div class="fr-select-group">
                <label class="fr-label" for="naf-section">Section</label>
                <select id="naf-section" class="fr-select" v-model="selectedSection" @change="onSectionChange">
                  <option value="">-- Priorité globale --</option>
                  <option v-for="section in mainSections" :key="section.code" :value="section.code">
                    {{ section.code }} – {{ section.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Niveau 2 : Division (visible si section choisie) -->
            <template v-if="selectedSection">
              <div class="fr-col-auto naf-arrow" aria-hidden="true">›</div>
              <div class="fr-col-12 fr-col-md-4">
                <div class="fr-select-group">
                  <label class="fr-label" for="naf-division">Division</label>
                  <select id="naf-division" class="fr-select" v-model="selectedDivision" @change="onDivisionChange">
                    <option value="">-- Toute la section {{ selectedSection }} --</option>
                    <option v-for="div in filteredDivisions" :key="div.NIV2" :value="div.NIV2">
                      {{ div.NIV2 }} – {{ div.label_vf }}
                    </option>
                  </select>
                </div>
              </div>
            </template>

            <!-- Niveau 3 : Code précis (visible si division choisie) -->
            <template v-if="selectedDivision">
              <div class="fr-col-auto naf-arrow" aria-hidden="true">›</div>
              <div class="fr-col-12 fr-col-md-4">
                <div class="fr-select-group">
                  <label class="fr-label" for="naf-code">Code précis</label>
                  <select id="naf-code" class="fr-select" v-model="selectedCode" @change="onCodeChange">
                    <option value="">-- Toute la division {{ selectedDivision }} --</option>
                    <option v-for="code in filteredCodes" :key="code.NIV5" :value="code.NIV5">
                      {{ code.NIV5 }} – {{ code.label_vf }}
                    </option>
                  </select>
                </div>
              </div>
            </template>
          </div>

          <!-- Fil d'ariane du filtre actif -->
          <p v-if="selectedNaf" class="fr-text--sm fr-mt-2w fr-mb-0">
            Filtre actif :
            <span class="fr-badge fr-badge--sm fr-badge--blue-cumulus">{{ selectedNaf }}</span>
            <span class="fr-ml-1w">{{ selectedNafLabel }}</span>
          </p>
        </div>

        <!-- En-tête du tableau -->
        <div class="fr-grid-row fr-grid-row--middle fr-mb-3w">
          <div class="fr-col">
            <span class="fr-badge fr-badge--sm fr-badge--info">{{ sortedProjects.length }} projets</span>
          </div>
          <div v-if="hasChanges" class="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <button class="fr-btn" @click="saveChanges" :disabled="saving">
              <span v-if="!saving" class="fr-icon-check-line fr-pr-1w" aria-hidden="true"></span>
              {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
            <button class="fr-btn fr-btn--secondary" @click="refresh" :disabled="saving">Annuler</button>
          </div>
        </div>

        <!-- Alertes -->
        <div v-if="successMessage" class="fr-alert fr-alert--success fr-mb-3w">
          <p class="fr-alert__title">{{ successMessage }}</p>
        </div>
        <div v-if="errorMessage" class="fr-alert fr-alert--error fr-mb-3w">
          <p class="fr-alert__title">{{ errorMessage }}</p>
        </div>

        <!-- Tableau des projets -->
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
              <tr
                v-for="project in sortedProjects"
                :key="project.id"
                draggable="true"
                @dragstart="handleDragStart(project.id)"
                @dragover.prevent="handleDragOver(project.id)"
                @drop="handleDrop"
                :class="{ 'is-dragging': draggingId === project.id }"
                class="project-row"
              >
                <td class="col-drag">
                  <div class="drag-bar">
                    <span></span><span></span><span></span>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    class="fr-input fr-input--sm"
                    :value="getPriority(project)"
                    @input="updatePriority(project, ($event.target as HTMLInputElement).value)"
                    step="0.1"
                    min="0"
                  />
                </td>
                <td class="fr-text--bold">{{ project.Titre || project.title || project.slug }}</td>
                <td>
                  <span class="fr-badge fr-badge--sm fr-badge--purple-glycine">
                    {{ getTheme(project) }}
                  </span>
                </td>
                <td class="fr-text--sm">{{ formatScore(project['Prio']) }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="fr-text--center fr-py-4w">Chargement des projets...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import nafCodesData from '../../../../../libs/data/static/nafMapping.json'

interface NafCode {
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}

// Type pour les données Baserow (format spécifique à l'API Baserow)
interface BaserowLinkedField {
  id: number
  value: string
}

interface BaserowProject {
  id: number
  slug?: string
  title?: string
  Titre?: string
  'Thématique principale'?: BaserowLinkedField[] | string
  'Prio'?: number | string
  'Prios spécifiques'?: string
}

const nafCodes = nafCodesData as NafCode[]

// --- Sélection NAF en cascade ---
const selectedSection = ref('')
const selectedDivision = ref('')
const selectedCode = ref('')

const selectedNaf = computed(() => selectedCode.value || selectedDivision.value || selectedSection.value)

const mainSections = computed(() => {
  const labels: Record<string, string> = {
    A: "Agriculture, sylviculture et pêche",
    B: "Industries extractives",
    C: "Industrie manufacturière",
    D: "Production et distribution d'électricité, gaz",
    E: "Production et distribution d'eau",
    F: "Construction",
    G: "Commerce",
    H: "Transports et entreposage",
    I: "Hébergement et restauration",
    J: "Information et communication",
    K: "Activités financières et d'assurance",
    L: "Activités immobilières",
    M: "Activités spécialisées, scientifiques et techniques",
    N: "Activités de services administratifs et de soutien",
    O: "Administration publique",
    P: "Enseignement",
    Q: "Santé humaine et action sociale",
    R: "Arts, spectacles et activités récréatives",
    S: "Autres activités de services",
    T: "Activités des ménages",
    U: "Activités extra-territoriales"
  }
  const sections = new Map<string, { code: string; label: string }>()
  nafCodes.forEach((code) => {
    if (!sections.has(code.NIV1)) {
      sections.set(code.NIV1, { code: code.NIV1, label: labels[code.NIV1] || code.NIV1 })
    }
  })
  return Array.from(sections.values()).sort((a, b) => a.code.localeCompare(b.code))
})

const filteredDivisions = computed(() => {
  if (!selectedSection.value) return []
  const divs = new Map<string, NafCode>()
  nafCodes
    .filter((c) => c.NIV1 === selectedSection.value)
    .forEach((c) => {
      if (!divs.has(c.NIV2)) divs.set(c.NIV2, c)
    })
  return Array.from(divs.values()).sort((a, b) => a.NIV2.localeCompare(b.NIV2))
})

const filteredCodes = computed(() => {
  if (!selectedDivision.value) return []
  return nafCodes.filter((c) => c.NIV2 === selectedDivision.value).sort((a, b) => a.NIV5.localeCompare(b.NIV5))
})

const nafMapping = computed(() => {
  const map = new Map<string, NafCode>()
  nafCodes.forEach((c) => {
    map.set(c.NIV5, c)
    map.set(c.NIV4, c)
    map.set(c.NIV3, c)
    map.set(c.NIV2, c)
    map.set(c.NIV1, c)
  })
  return map
})

const selectedNafLabel = computed(() => {
  const naf = selectedNaf.value
  if (!naf) return ''
  const code = nafMapping.value.get(naf)
  return code ? code.label_vf : ''
})

const onSectionChange = () => {
  selectedDivision.value = ''
  selectedCode.value = ''
}

const onDivisionChange = () => {
  selectedCode.value = ''
}

const onCodeChange = () => {
  // rien de particulier
}

// --- Données projets ---
const projects = ref<BaserowProject[]>([])
const loading = ref(false)
const saving = ref(false)
const hasChanges = ref(false)
const draggingId = ref<number | null>(null)
const successMessage = ref('')
const errorMessage = ref('')

const formatScore = (score: number | string | undefined): string => {
  const n = parseFloat(score as string)
  if (isNaN(n)) return 'N/A'
  return n.toFixed(1)
}

const getTheme = (project: BaserowProject): string => {
  const theme = project['Thématique principale']
  if (!theme) return 'N/A'
  if (Array.isArray(theme)) return theme[0]?.value || 'N/A'
  return theme
}

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
  return project.Prio ?? 9999
}

const sortedProjects = computed(() =>
  [...projects.value].sort((a, b) => getPriority(a) - getPriority(b))
)

const refresh = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  hasChanges.value = false

  try {
    const data = await $fetch<BaserowProject[]>('/api/projects/priorities')
    projects.value = Array.isArray(data) ? data : []
  } catch (e) {
    errorMessage.value = 'Erreur lors du chargement des projets'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const updatePriority = (project: BaserowProject, newVal: string) => {
  const value = parseFloat(newVal)
  if (isNaN(value) || value < 0) return

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

// --- Drag & Drop (basé sur les IDs pour éviter les bugs d'index après re-tri) ---
const handleDragStart = (id: number) => {
  draggingId.value = id
}

const handleDragOver = (targetId: number) => {
  if (draggingId.value === null || draggingId.value === targetId) return

  const list = sortedProjects.value
  const targetIndex = list.findIndex((p) => p.id === targetId)
  const draggedProject = projects.value.find((p) => p.id === draggingId.value)

  if (!draggedProject || targetIndex === -1) return

  let newScore: number
  if (targetIndex === 0) {
    newScore = getPriority(list[0]) - 1
  } else if (targetIndex === list.length - 1) {
    newScore = getPriority(list[list.length - 1]) + 1
  } else {
    const prevScore = getPriority(list[targetIndex - 1])
    const nextScore = getPriority(list[targetIndex])
    newScore = (prevScore + nextScore) / 2
  }

  updatePriority(draggedProject, newScore.toString())
}

const handleDrop = () => {
  draggingId.value = null
}

// --- Sauvegarde ---
const saveChanges = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const updates = projects.value.map((p) => ({
      id: p.id,
      'Prio': parseFloat(p['Prio'] as string) || undefined,
      'Prios spécifiques': p['Prios spécifiques'] || ''
    }))

    await $fetch('/api/projects/priorities', {
      method: 'PATCH',
      body: { updates, nafCode: selectedNaf.value }
    })

    successMessage.value = 'Modifications enregistrées avec succès !'
    hasChanges.value = false

    setTimeout(() => {
      successMessage.value = ''
      refresh()
    }, 1500)
  } catch (e) {
    errorMessage.value = "Erreur lors de l'enregistrement"
    console.error(e)
  } finally {
    saving.value = false
  }
}

onMounted(refresh)

watch(selectedNaf, () => {
  errorMessage.value = ''
  successMessage.value = ''
})
</script>

<style scoped>
.naf-selector {
  background-color: #f5f5fe;
  border-radius: 0.25rem;
}

.naf-arrow {
  font-size: 1.5rem;
  color: #6a6af4;
  line-height: 1;
  padding-top: 1.5rem;
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
