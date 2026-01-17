<script setup lang="ts">
import type { DataProject } from '@tee/data'

const props = defineProps<{
  projets: DataProject[]
}>()

// On garde les logs console pour le dev
console.log('🔍 Nombre de projets:', props.projets?.length)
</script>

<template>
  <div class="flex flex-col gap-4 max-h-[calc(100vh-120px)]">
    
    <div class="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs shrink-0">
      <div class="flex justify-between items-center mb-1">
        <p class="font-bold text-blue-900 text-sm">Debug : {{ projets?.length || 0 }} projets</p>
      </div>
      <div v-if="projets && projets.length > 0" class="relative">
        <pre class="max-h-32 overflow-y-auto bg-white/50 p-2 rounded border border-blue-200 font-mono scale-[0.95] origin-top-left">
{{ projets[0] }}
        </pre>
      </div>
    </div>

    <div class="overflow-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <table class="w-full text-xs text-left text-gray-500 border-collapse">
        <thead class="text-[10px] text-gray-700 uppercase bg-gray-50 sticky top-0 shadow-sm z-10">
          <tr>
            <th scope="col" class="px-3 py-2 w-8 text-center">#</th>
            <th scope="col" class="px-3 py-2 font-bold uppercase">Nom du Projet</th>
            <th scope="col" class="px-3 py-2 w-24">Status</th>
            <th scope="col" class="px-3 py-2 w-24 text-right font-bold">Priorité</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="projet in projets"
            :key="projet.id"
            class="hover:bg-blue-50/30 transition-colors"
          >
            <td class="px-3 py-1.5 text-gray-300 text-center cursor-move">☰</td>
            <td class="px-3 py-1.5 font-medium text-gray-900 truncate max-w-xs lg:max-w-md">
              {{ projet.Titre || projet.title || 'Sans titre' }}
            </td>
            <td class="px-3 py-1.5">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                :class="projet.status === 'En prod' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
              >
                {{ projet.status || 'N/A' }}
              </span>
            </td>
            <td class="px-3 py-1.5 text-right">
              <input
                v-model.number="projet.priorite"
                type="number"
                class="w-16 ml-auto bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded p-1 text-center focus:ring-1 focus:ring-blue-400 outline-none"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!projets || projets.length === 0" class="p-8 text-center text-gray-400 italic">
        Aucun projet trouvé.
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar fine pour le confort visuel */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>