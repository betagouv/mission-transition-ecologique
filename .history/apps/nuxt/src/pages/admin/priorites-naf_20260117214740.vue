<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

// 1. Récupération des données
const {
  data: projects,
  pending,
  error
} = await useFetch<DataProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')

// 2. Logique de filtrage et de tri
const projetsFiltres = computed(() => {
  const baseProjects = projects.value || []
  
  // DEBUG : On vérifie combien de projets on a au total avant filtrage
  console.log('--- DEBUG DONNÉES ---')
  console.log('Total reçu de l\'API:', baseProjects.length)

  if (!selectedNaf.value) {
    return sortProjectsByPriority(baseProjects)
  }

  // Extraction de la lettre du code NAF (ex: "85.59A" -> "A")
  const secteurLettre = selectedNaf.value.match(/[A-Z]$/)?.[0]
  console.log('Filtrage sur la lettre :', secteurLettre)

  const filtered = baseProjects.filter((p) => {
    // On utilise le champ 'sectors' identifié dans ton debug JSON
    return p.sectors && Array.isArray(p.sectors) && p.sectors.includes(secteurLettre)
  })

  console.log('Nombre après filtrage :', filtered.length)
  
  return sortProjectsByPriority(filtered)
})

// 3. Action lors du changement de filtre
const handleFilterChange = (val: string) => {
  selectedNaf.value = val
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <header>
      <h1 class="text-2xl font-bold text-gray-800">
        Administration : Priorités NAF
      </h1>
      <p class="text-sm text-gray-500">
        Gérez l'ordre d'affichage des projets par secteur d'activité.
      </p>
    </header>

    <FiltreNaf @change="handleFilterChange" />

    <main class="mt-8">
      <div v-if="pending" class="flex flex-col items-center py-20 text-gray-500">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="italic">Chargement des données depuis Baserow...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded