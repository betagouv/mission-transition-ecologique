<script setup lang="ts">
import { ref, computed } from 'vue'
import { sortProjectsByPriority } from '@tee/data'
import type { DataProject } from '@tee/data'
import FiltreNaf from '../../components/admin/filtre-naf.vue'
import ListeProjets from '../../components/admin/liste-projets.vue'

// On récupère les données sans aucune transformation restrictive
const {
  data: projects,
  pending,
  error
} = await useFetch<any>('/api/projects', {
  // On s'assure de prendre 'results' si c'est un objet Baserow, sinon la data brute
  transform: (data: any) => data.results || data
})

const selectedNaf = ref('')

// On désactive TOUS les filtres ici
const projetsFiltres = computed(() => {
  const allRawProjects = projects.value || []
  
  // LOG DE SÉCURITÉ : Pour voir exactement ce qui sort du tuyau API
  console.log('--- TEST TOTAL ---')
  console.log('Nombre de projets reçus du serveur:', allRawProjects.length)
  if (allRawProjects.length > 0) {
    console.log('Exemple du premier projet reçu:', allRawProjects[0])
  }

  // On renvoie TOUT sans filtrer par lettre ou par titre
  // On garde juste le tri par priorité pour que la liste soit lisible
  return sortProjectsByPriority(allRawProjects)
})