<script setup lang="ts">
import { ref, computed } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'

const { data: projects, refresh } = await useFetch<DataProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')
const hasChanges = ref(false)
const isSaving = ref(false)

// On crée une copie de travail pour ne pas modifier les données fetchées directement
const localProjects = ref<DataProject[]>([])

// Initialisation de la copie locale quand les données arrivent
watch(projects, (newVal) => {
  if (newVal) localProjects.value = [...newVal]
}, { immediate: true })

const projetsFiltres = computed(() => {
  const base = localProjects.value
  const secteurLettre = selectedNaf.value.match(/[A-Z]$/)?.[0]
  
  const filtered = secteurLettre 
    ? base.filter(p => p.sectors?.includes(secteurLettre))
    : base

  return sortProjectsByPriority(filtered)
})

const onUpdatePriorities = (newList: DataProject[]) => {
  hasChanges.value = true
  // On met à jour la liste locale avec les nouvelles priorités
  localProjects.value = localProjects.value.map(p => {
    const match = newList.find(n => n.id === p.id)
    return match ? { ...p, priorite: match.priorite } : p
  })
}

// Fonction de sauvegarde vers Baserow
const saveChanges = async () => {
  isSaving.value = true
  try {
    // On envoie uniquement les projets qui ont été chargés
    await $fetch('/api/projects/update-batch', {
      method: 'PATCH',
      body: { 
        items: localProjects.value.map(p => ({ id: p.id, priorite: p.priorite })) 
      }
    })
    hasChanges.value = false
    alert('Priorités sauvegardées !')
    await refresh()
  } catch (e) {
    alert('Erreur lors de la sauvegarde')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Priorités</h1>
      
      <button 
        v-if="hasChanges"
        @click="saveChanges"
        :disabled="isSaving"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition-all flex items-center gap-2"
      >
        <span v-if="isSaving" class="animate-spin text-lg">↻</span>
        {{ isSaving ? 'Sauvegarde...' : 'Enregistrer les changements' }}
      </button>
    </div>

    <FiltreNaf @change="(val) => selectedNaf = val" />

    <div class="mt-8 relative">
      <ListeProjets 
        :projets="projetsFiltres" 
        @update:priorities="onUpdatePriorities"
      />
    </div>
  </div>
</template>