<script setup lang="ts">
import type { DataProject } from '@tee/data'

const props = defineProps<{
  projets: DataProject[]
}>()
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    
    <div class="p-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
      <p class="text-xs font-bold text-blue-900">
        {{ projets?.length || 0 }} projets chargés
      </p>
      <span class="text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
        Filtré par titre (statut indifférent)
      </span>
    </div>

    <table class="w-full text-sm text-left text-gray-500 table-fixed">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
        <tr>
          <th scope="col" class="px-4 py-3 w-12 text-center">Tri</th>
          <th scope="col" class="px-4 py-3 w-auto font-bold text-gray-900">Nom du Projet</th>
          <th scope="col" class="px-4 py-3 w-32">Status</th>
          <th scope="col" class="px-4 py-3 w-24 text-right font-bold">Priorité</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="projet in projets"
          :key="projet.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-2 text-center text-gray-400 cursor-move">☰</td>
          
          <td class="px-4 py-2 font-medium text-gray-900 truncate" :title="projet.Titre || projet.title">
            {{ projet.Titre || projet.title || 'Sans titre' }}
          </td>
          
          <td class="px-4 py-2">
            <span
              class="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
              :class="projet.status === 'En prod' 
                ? 'bg-green-100 text-green-800' 
                : (projet.status ? 'bg-gray-100 text-gray-800' : 'bg-yellow-50 text-yellow-700 border border-yellow-200')"
            >
              {{ projet.status || 'Non défini' }}
            </span>
          </td>
          
          <td class="px-4 py-2 text-right">
            <input
              v-model.number="projet.priorite"
              type="number"
              class="w-16 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded block p-1 text-center focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="!projets || projets.length === 0"
      class="p-10 text-center text-gray-500 italic"
    >
      Aucun projet avec un titre n'a été trouvé.
    </div>
  </div>
</template>