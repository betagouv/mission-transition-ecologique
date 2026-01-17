<script setup lang="ts">
import { ref, computed } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

const {
  data: projects,
  pending,
  error
} = await useFetch<DataProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')

const projetsFiltres = computed(() => {
  const baseProjects = projects.value || []

  if (!selectedNaf.value) {
    return sortProjectsByPriority(baseProjects)
  }

  // LOGIQUE DE FILTRAGE PAR SECTEUR (Lettre)
  const secteurLettre = selectedNaf.value.match(/[A-Z]$/)?.[0]

  const filtered = baseProjects.filter((p) => {
    // On vérifie si la lettre est présente dans le tableau 'sectors' du projet
    return p.sectors && Array.isArray(p.sectors) && p.sectors.includes(secteurLettre)
  })

  return sortProjectsByPriority(filtered)
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Administration : Priorités NAF</h1>

    <FiltreNaf @change="(val: string) => (selectedNaf = val)" />

    <div class="mt-8">
      <div v-if="pending" class="text-center py-10 text-gray-500 italic">
        Chargement des projets...
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">
        Erreur : {{ error.statusMessage }}
      </div>

      <ListeProjets v-else :projets="projetsFiltres" />

      <div class="mt-4 text-xs text-gray-400">
        Total : {{ projetsFiltres.length }} projets affichés pour le secteur {{ selectedNaf.match(/[A-Z]$/)?.[0] ||
        'Tous' }}
      </div>
    </div>
  </div>
</template>