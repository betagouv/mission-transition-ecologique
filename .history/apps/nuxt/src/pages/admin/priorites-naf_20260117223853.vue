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
const hasChanges = ref(false)
const isSaving = ref(false)

// On crée une version locale des projets pour pouvoir les manipuler
const localProjects = ref<DataProject[]>([])

// Synchronisation initiale
watch(projects, (newVal) => {
  if (newVal) localProjects.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const projetsFiltres = computed(() => {
  const base = localProjects.value || []
  if (!selectedNaf.value) return sortProjectsByPriority(base)
  const secteurLettre = selectedNaf.value.match(/[A-Z]$/)?.[0]
  const filtered = base.filter((p) => p.sectors?.includes(secteurLettre))
  return sortProjectsByPriority(filtered)
})

// Détection des changements dans le tableau
const handleUpdate = () => {
  hasChanges.value = true
}

// Envoi à Baserow
const saveToBaserow = async () => {
  isSaving.value = true
  try {
    await $fetch('/api/projects/update-batch', {
      method: 'PATCH',
      body: { 
        items: localProjects.value.map(p => ({ id: p.id, priorite: p.priorite })) 
      }
    })
    hasChanges.value = false
    alert('Modifications enregistrées !')
    await refresh()
  } catch (e) {
    alert('Erreur lors de la sauvegarde.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Administration : Priorités NAF</h1>
      
      <button 
        v-if="hasChanges"
        @click="saveToBaserow"
        :disabled="isSaving"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all"
      >
        {{ isSaving ? 'Enregistrement...' : 'Valider les changements' }}
      </button>
    </div>

    <FiltreNaf @change="(val: string) => (selectedNaf = val)" />

    <div class="mt-8">
      <div v-if="pending" class="text-center py-10 text-gray-500 italic">Chargement...</div>
      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">Erreur : {{ error.statusMessage }}</div>

      <ListeProjets 
        v-else 
        :projets="projetsFiltres" 
        @update="handleUpdate"
      />
      
      <div class="mt-4 text-xs text-gray-400">
        Total : {{ projetsFiltres.length }} projets affichés
      </div>
    </div>
  </div>
</template>