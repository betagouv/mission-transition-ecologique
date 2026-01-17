<script setup lang="ts">
import type { DataProject } from '@tee/data'

const props = defineProps<{
  projets: DataProject[]
}>()

console.log('🔍 Projets reçus:', props.projets)
console.log('🔍 Nombre de projets:', props.projets?.length)
if (props.projets?.length > 0) {
  console.log('🔍 Premier projet:', props.projets[0])
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="p-4 bg-blue-50 mb-4 rounded">
      <p class="font-bold text-blue-900 mb-2">Debug - Données reçues :</p>
      <p class="text-sm text-blue-800">Nombre de projets : {{ projets?.length || 0 }}</p>
      <div
        v-if="projets && projets.length > 0"
        class="mt-2"
      >
        <p class="text-xs font-mono text-blue-700">Premier projet :</p>
        <pre class="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">{{ projets[0] }}</pre>
      </div>
    </div>

    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
        <tr>
          <th
            scope="col"
            class="px-6 py-4 w-10"
          >
            Tri
          </th>
          <th
            scope="col"
            class="px-6 py-4 font-bold"
          >
            Nom du Projet
          </th>
          <th
            scope="col"
            class="px-6 py-4"
          >
            Status
          </th>
          <th
            scope="col"
            class="px-6 py-4 text-right font-bold"
          >
            Priorité
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="projet in projets"
          :key="projet.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="px-6 py-4 text-gray-400 cursor-move">☰</td>
          <td class="px-6 py-4 font-medium text-gray-900">
            {{ projet.Titre || projet.title || 'Sans titre' }}
          </td>
          <td class="px-6 py-4">
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="projet.status === 'En prod' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ projet.status || 'N/A' }}
            </span>
          </td>
          <td class="px-6 py-4 text-right">
            <input
              v-model.number="projet.priorite"
              type="number"
              class="w-20 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 text-center"
              :placeholder="projet.priorite?.toString() || '0'"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="!projets || projets.length === 0"
      class="p-10 text-center text-gray-500 italic"
    >
      Aucun projet trouvé pour ce code NAF.
    </div>
  </div>
</template>
