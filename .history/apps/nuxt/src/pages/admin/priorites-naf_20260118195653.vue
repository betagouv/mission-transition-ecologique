<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

interface BaserowProject extends DataProject {
  "Thématique principale"?: { value: string; id: number; color?: string } | string;
}

// 1. Utilise une seule source de vérité pour éviter les conflits
const { data: projects, pending, error, refresh } = await useFetch<BaserowProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')
const localProjects = ref<BaserowProject[]>([])

// Initialisation propre
watch(projects, (newVal) => {
  if (newVal) localProjects.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const projetsFiltres = computed({
  get: () => {
    // On travaille toujours sur localProjects pour garder les modifs en mémoire
    const dataToFilter = localProjects.value;
    
    if (!selectedNaf.value) {
      return sortProjectsByPriority(dataToFilter);
    }

    return sortProjectsByPriority(
      dataToFilter.filter(p => {
        const rawValue = p["Thématique principale"];
        // Extraction sécurisée de la string
        const label = typeof rawValue === 'object' ? rawValue?.value : rawValue;
        
        if (!label) return false;

        // Comparaison flexible (ignore les espaces et la casse)
        return label.toString().trim().toLowerCase() === selectedNaf.value.toLowerCase();
      })
    );
  },
  set: (newOrder) => {
    isModified.value = true
    // On met à jour l'ordre global sans perdre les projets filtrés
    const updatedList = [...localProjects.value];
    
    newOrder.forEach((project, index) => {
      const targetIndex = updatedList.findIndex(p => p.id === project.id);
      if (targetIndex !== -1) {
        updatedList.splice(targetIndex, 1);
        updatedList.splice(index, 0, project);
      }
    });

    localProjects.value = updatedList.map((p, idx) => ({
      ...p,
      priorite: idx + 1
    }));
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