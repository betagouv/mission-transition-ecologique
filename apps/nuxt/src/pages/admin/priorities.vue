<template>
  <div class="fr-container fr-py-6w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1 class="fr-h2 fr-mb-4w">Gestion des priorités</h1>

        <div class="fr-select-group fr-p-4w fr-background-alt--blue-france fr-rounded-md">
          <label class="fr-label fr-text--bold" for="naf-select">Secteur d'activité (Code NAF)</label>
          <select id="naf-select" class="fr-select" v-model="selectedNaf">
            <option value="">-- Priorité Globale --</option>
            <option value="A">A - Agriculture</option>
            <option value="B">B - Industries extractives</option>
            <option value="C">C - Industrie</option>
            <option value="D">D - Électricité, gaz</option>
            <option value="E">E - Eau</option>
            <option value="F">F - Construction</option>
            <option value="G">G - Commerce</option>
            <option value="H">H - Transports</option>
            <option value="I">I - Hébergement / Restauration</option>
            <option value="Q">Q - Santé</option>
            <option value="55">55 - Hébergement</option>
            <option value="56">56 - Restauration</option>
            <option value="86">86 - Santé humaine</option>
          </select>
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
                      @input="updatePriority(project, ($event.target as HTMLInputElement).value)" min="1" />
                  </td>
                  <td class="fr-text--bold">{{ project.title || project.Titre || project.Nom || project.slug }}</td>
                  <td>
                    <span class="fr-badge fr-badge--sm fr-badge--purple-glycine">
                      {{ project['Thématique principale'] || project.mainTheme || 'N/A' }}
                    </span>
                  </td>
                  <td class="fr-text--sm">{{ project.priority?.default || project.Prio || 'N/A' }}</td>
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
import { ref, computed, watch } from 'vue'

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

const selectedNaf = ref('')
const projects = ref<Project[]>([])
const loading = ref(false)
const saving = ref(false)
const hasChanges = ref(false)
const draggingIndex = ref<number | null>(null)
const successMessage = ref('')
const errorMessage = ref('')

// Récupérer la priorité d'un projet
const getPriority = (project: Project): number => {
  if (!selectedNaf.value) {
    // Mode priorité globale
    return project.Prio ?? project['# Prio'] ?? project.priority?.default ?? 9999
  }

  // Mode code NAF : chercher dans "Prios spécifiques"
  const priosSpec = project['Prios spécifiques'] || ''

  // Regex pour matcher "CODE:NOMBRE" avec espaces autour
  const regex = new RegExp(`(?:^|\\s)${selectedNaf.value.replace('.', '\\.')}:(\\d+)(?:\\s|$)`)
  const match = priosSpec.match(regex)

  if (match) {
    return parseInt(match[1])
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
  const value = parseInt(newVal)

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

  // On récupère la liste actuelle triée
  const list = [...sortedProjects.value]

  // On déplace l'élément dans le tableau
  const draggedItem = list.splice(draggingIndex.value, 1)[0]
  list.splice(index, 0, draggedItem)

  // On ré-attribue les priorités de 1 à N-projets pour toute la liste pour éviter les doublons
  list.forEach((project, idx) => {
    const newPrio = idx + 1
    updatePriority(project, newPrio.toString())
  })

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
refresh()

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
  width: 5rem;
}

.fr-input--sm:focus {
  outline: none;
  border-bottom-color: #0063cb;
}
</style>