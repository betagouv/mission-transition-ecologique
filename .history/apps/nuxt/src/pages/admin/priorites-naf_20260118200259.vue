<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

// Mise à jour de l'interface pour supporter le format "Lien vers une table" (tableau d'objets)
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

        // Extraction de la valeur selon le format envoyé par Baserow
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          // Cas "Relations multiples" (Tableau)
          stringValue = rawValue[0].value; 
        } else if (typeof rawValue === 'object' && rawValue !== null) {
          // Cas "Relation simple" (Objet)
          stringValue = (rawValue as any).value;
        } else {
          // Cas texte brut
          stringValue = rawValue as string;
        }

        // Comparaison robuste (ignore la casse et les espaces)
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
      priorite