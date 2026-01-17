<script setup lang="ts">
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import ListeProjets from '../../components/admin/liste-projets.vue'

// On récupère les données brutes
const {
  data: projects,
  pending,
  error
} = await useFetch<DataProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

// On trie simplement par priorité sans aucun filtre de secteur
const projetsBruts = computed(() => {
  return sortProjectsByPriority(projects.value || [])
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Test de Réception Totale</h1>

    <div class="mt-8">
      <div v-if="pending" class="text-center py-10 text-gray-500 italic">
        Chargement de la base complète...
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">
        Erreur : {{ error.statusMessage }}
      </div>

      <div v-else>
        <ListeProjets :projets="projetsBruts" />
        
        <div class="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
          <p class="font-bold text-gray-700">Rapport de test :</p>
          <p class="text-lg">Nombre total de projets affichés : <span class="text-blue-600">{{ projetsBruts.length }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>