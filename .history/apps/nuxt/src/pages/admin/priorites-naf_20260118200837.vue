<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

// 1. Interface mise à jour pour accepter le format "Lien vers une table" de Baserow
interface BaserowProject extends DataProject {
  "Thématique principale"?: Array<{ value: string; id: number; color?: string }> | { value: string; id: number } | string;
}

const { data: projects, pending, error, refresh } = await useFetch<BaserowProject[]>('/api/projects', {
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')
const localProjects = ref<BaserowProject[]>([])
const isModified = ref(false)

// 2. Initialisation réactive de la copie locale
watch(projects, (newVal) => {
  if (newVal) localProjects.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const projetsFiltres = computed({
  get: () => {
    // On utilise la copie locale si elle existe, sinon les données brutes
    const base = localProjects.value.length > 0 ? localProjects.value : (projects.value || [])
    
    if (!selectedNaf.value) return sortProjectsByPriority(base)

    return sortProjectsByPriority(
      base.filter(p => {
        // RÉCUPÉRATION DE LA THÉMATIQUE
        const rawValue = p["Thématique principale"];
        let label = '';

        // Cas A : C'est un tableau (Relations multiples dans Baserow)
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          label = rawValue[0].value;
        } 
        // Cas B : C'est un objet (Relation simple ou Select)
        else if (typeof rawValue === 'object' && rawValue !== null) {
          label = (rawValue as any).value;
        } 
        // Cas C : C'est une string brute
        else if (typeof rawValue === 'string') {
          label = rawValue;
        }

        if (!label) return false;

        // COMPARAISON : On passe tout en minuscules et on enlève les espaces
        return label.toString().trim().toLowerCase() === selectedNaf.value.toLowerCase().trim();
      })
    )
  },
  set: (newOrder) => {
    isModified.value = true
    const fullList = [...localProjects.value]

    // Mise à jour de l'ordre global basé sur le nouvel ordre filtré
    newOrder.forEach((project, index) => {
      const globalIndex = fullList.findIndex(p => p.id === project.id)
      if (globalIndex !== -1) {
        fullList.splice(globalIndex, 1)
        fullList.splice(index, 0, project)
      }
    })

    // Ré-attribution des numéros de priorité (1, 2, 3...)
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
    alert('Priorités sauvegardées avec succès !')
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
        class="bg-blue-800 hover:bg-blue-600 text-white px-4 py-2 font-bold rounded shadow-md transition-colors">
        Valider les changements
      </button>
    </div>

    <FiltreNaf @change="(val: string) => (selectedNaf = val)" />

    <div class="mt-8">
      <div v-if="pending" class="text-center py-10 text-gray-500 italic">Chargement des projets...</div>
      
      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
        Erreur de chargement : {{ error.statusMessage || 'Impossible de joindre Baserow' }}
      </div>

      <div v-else>
        <ListeProjets v-model:projets="projetsFiltres" />

        <div v-if="projetsFiltres.length === 0" class="text-center py-10 text-gray-400">
          Aucun projet trouvé pour cette thématique.
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded text-xs text-gray-500 flex justify-between">
          <span>Total : <strong>{{ projetsFiltres.length }}</strong> projets affichés</span>
          <span>Filtre actuel : <span class="font-mono text-blue-600">{{ selectedNaf || 'Tous' }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>