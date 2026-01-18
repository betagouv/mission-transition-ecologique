<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

const { data: projects, pending, error, refresh } = await useFetch<DataProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')
const localProjects = ref<DataProject[]>([])
const isModified = ref(false)

watch(projects, (newVal) => {
  if (newVal) localProjects.value = [...newVal]
}, { immediate: true })

const projetsFiltres = computed({
  get: () => {
    const base = localProjects.value.length > 0 ? localProjects.value : (projects.value || [])
    if (!selectedNaf.value) return sortProjectsByPriority(base)
    
    return sortProjectsByPriority(base.filter(p => p['Thématique principale'] === selectedNaf.value))
  },
  set: (newOrder) => {
    isModified.value = true
    const updated = newOrder.map((p, index) => ({ ...p, priorite: index + 1 }))
    const otherProjects = localProjects.value.filter(lp => !updated.find(u => u.id === lp.id))
    localProjects.value = [...updated, ...otherProjects]
  }
})

const saveChanges = async () => {
  try {
    await $fetch('/api/projects', {
      method: 'PATCH',
      body: { items: localProjects.value }
    })
    isModified.value = false
    alert('Priorités sauvegardées !')
    await refresh()
  } catch (err) {
    alert('Erreur lors de la sauvegarde')
  }
}
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Administration : Priorités NAF</h1>

      <button v-if="isModified" @click="saveChanges"
        class="bg-blue-800 hover:!bg-blue-600 text-white px-4 py-2 font-bold">
        Valider les changements
      </button>
    </div>

    <FiltreNaf @change="(val: string) => (selectedNaf = val)" />

    <div class="mt-8">
      <div v-if="pending" class="text-center py-10 text-gray-500 italic">Chargement...</div>
      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">Erreur : {{ error.statusMessage }}</div>

      <ListeProjets v-else v-model:projets="projetsFiltres" />

      <div class="mt-4 text-xs text-gray-400">
        Total : {{ projetsFiltres.length }} projets affichés pour le secteur {{ selectedNaf.match(/[A-Z]$/)?.[0] ||
          'Tous' }}
      </div>
    </div>
  </div>
</template>