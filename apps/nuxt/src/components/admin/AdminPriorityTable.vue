<template>
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
          v-for="project in projects"
          :key="project.id"
          draggable="true"
          @dragstart="handleDragStart(project.id)"
          @dragover.prevent="handleDragOver(project.id)"
          @drop="handleDrop"
          :class="{ 'is-dragging': draggingId === project.id }"
          class="project-row"
        >
          <td class="col-drag"><div class="drag-bar"><span></span><span></span><span></span></div></td>
          <td>
            <input
              type="number"
              class="fr-input fr-input--sm"
              :value="project.currentPriority"
              @input="emit('update-priority', project.id, ($event.target as HTMLInputElement).value)"
              step="0.1"
              min="0"
            />
          </td>
          <td class="fr-text--bold">{{ project.Titre || project.title || project.slug }}</td>
          <td><span class="fr-badge fr-badge--sm fr-badge--purple-glycine">{{ project.theme }}</span></td>
          <td class="fr-text--sm">{{ formatScore(project['Prio']) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr><td colspan="5" class="fr-text--center fr-py-4w">Chargement des projets...</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from '~/types/baserow'

const props = defineProps<{
  projects: ProjectRow[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update-priority', id: number, value: string): void
}>()

const draggingId = ref<number | null>(null)

const formatScore = (score: number | string | undefined): string => {
  const n = parseFloat(score as string)
  return isNaN(n) ? 'N/A' : n.toFixed(1)
}

const handleDragStart = (id: number) => {
  draggingId.value = id
}

const handleDragOver = (targetId: number) => {
  if (draggingId.value === null || draggingId.value === targetId) return
  const list = props.projects
  const targetIndex = list.findIndex((p) => p.id === targetId)
  if (targetIndex === -1) return

  let newScore: number
  if (targetIndex === 0) {
    newScore = list[0].currentPriority - 1
  } else if (targetIndex === list.length - 1) {
    newScore = list[list.length - 1].currentPriority + 1
  } else {
    newScore = (list[targetIndex - 1].currentPriority + list[targetIndex].currentPriority) / 2
  }
  emit('update-priority', draggingId.value, newScore.toString())
}

const handleDrop = () => {
  draggingId.value = null
}
</script>

<style scoped>
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
