<script setup lang="ts">
import { ref, computed } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

// On récupère les projets
const {
  data: projects,
  pending,
  error
} = await useFetch<DataProject[]>('/api/projects', {
  // Le transform s'assure qu'on récupère bien le tableau, peu importe la structure
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')

const projetsFiltres = computed(() => {
  const baseProjects = projects.value || []
  
  if (!selectedNaf.value) {
    return sortProjectsByPriority(baseProjects)
  }

  // LOGIQUE BASÉE SUR TON DEBUG :
  // On extrait la lettre du code NAF sélectionné (ex: "85.59A" -> "A")
  const secteurLettre = selectedNaf.value.match(/[A-Z]$/)?.[0]

  const filtered = baseProjects.filter((p) => {
    // Ton debug a montré que les secteurs sont dans p.sectors (ex: ["A", "B", "C"])
    // On vérifie si la lettre extraite est présente dans ce tableau
    return p.sectors && p.sectors.includes(secteurLettre)
  })

  return sortProjectsByPriority(filtered)
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Administration : Priorités NAF</h1>

    <FiltreNaf @change="(val: string) => (selectedNaf = val)" />

    <div class="mt-8">
      <div
        v-if="pending"
        class="text-center py-10 text-gray-500 italic"
      >
        Chargement des projets depuis Baserow...
      </div>

      <div
        v-else-if="error"
        class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200"
      >
        Erreur lors de la récupération : {{ error.statusMessage || "Impossible de contacter l'API" }}
      </div>

      <ListeProjets
        v-else
        :projets="projetsFiltres"
      />
      
      <p v-if="selectedNaf" class="mt-4 text-sm text-gray-500 italic">
        Filtre actif : {{ selectedNaf }} ({{ projetsFiltres.length }} projets trouvés)
      </p>
    </div>
  </div>
</template>