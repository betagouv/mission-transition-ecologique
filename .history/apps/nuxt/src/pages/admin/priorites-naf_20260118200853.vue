<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

// Mise à jour de l'interface pour accepter un tableau (format "Lien vers une table")
interface BaserowProject extends DataProject {
  "Thématique principale"?: Array<{ value: string; id: number; color?: string }> | { value: string; id: number } | string;
}

const { data: projects, pending, error, refresh } = await useFetch<BaserowProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')
const localProjects = ref<BaserowProject[]>([])
const isModified = ref(false)

watch(projects, (newVal) => {
  if (newVal) localProjects.value = [...newVal]
}, { immediate: true })

const projetsFiltres = computed({
  get: () => {
    const base = localProjects.value.length > 0 ? localProjects.value : (projects.value || [])
    if (!selectedNaf.value) return sortProjectsByPriority(base)

    return sortProjectsByPriority(
      base.filter(p => {
        const rawValue = p["Thématique principale"];
        let stringValue = '';

        // LOGIQUE DE FILTRAGE MISE À JOUR :
        // 1. Cas "Lien vers une table" avec relations multiples (Tableau)
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          stringValue = rawValue[0].value; 
        } 
        // 2. Cas "Lien vers une table" simple ou "Liste de sélection" (Objet)
        else if (typeof rawValue === 'object' && rawValue !== null) {
          stringValue = (rawValue as any).value;
        } 
        // 3. Cas Texte brut (String)
        else {
          stringValue = rawValue as string;
        }

        // Comparaison insensible à la casse et aux espaces pour éviter les erreurs de saisie
        return stringValue?.toString().toLowerCase().trim() === selectedNaf.value.toLowerCase().trim();
      })
    )
  },
  set: (newOrder) => {
    isModified.value = true
    const fullList = [...localProjects.value]

    newOrder.forEach((project, index) => {
      const globalIndex = fullList.findIndex(p => p.id === project.id)
      if (globalIndex !== -1) {
        fullList.splice(globalIndex, 1)
        fullList.splice(index, 0, project)
      }
    })

    localProjects.value = fullList.map((p, idx) => ({
      ...p,
      priorite: idx + 1
    }))
  }
})

const saveChanges = async () => {
  try {
    await $fetch('/api/projects', {
      method: 'PATCH',
      body: { items: localProjects.value }
    })
    isModified.value = false
    alert('Priorités sauvegardées dans Baserow !')
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
        Total : {{ projetsFiltres.length }} projets affichés pour le secteur {{ selectedNaf || 'Toutes les thématiques' }}
      </div>
    </div>
  </div>
</template>