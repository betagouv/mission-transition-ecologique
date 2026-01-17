<script setup lang="ts">
import draggable from 'vuedraggable'
import type { DataProject } from '@tee/data'

const props = defineProps<{
  projets: DataProject[]
}>()

const emit = defineEmits(['update:priorities'])

// On travaille sur une copie locale pour le drag and drop
const list = computed({
  get: () => props.projets,
  set: (newList) => {
    // Quand on drag & drop, on recalcule les priorités selon l'ordre visuel
    const updatedList = newList.map((item, index) => ({
      ...item,
      priorite: index + 1 // La priorité devient l'index (1, 2, 3...)
    }))
    emit('update:priorities', updatedList)
  }
})

// Quand on change le nombre manuellement dans l'input
const handleInput = () => {
  emit('update:priorities', props.projets)
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <table class="w-full text-sm text-left text-gray-500 table-fixed">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
        <tr>
          <th scope="col" class="px-4 py-3 w-12 text-center">Tri</th>
          <th scope="col" class="px-4 py-3 w-auto font-bold text-gray-900">Nom du Projet</th>
          <th scope="col" class="px-4 py-3 w-32">Status</th>
          <th scope="col" class="px-4 py-3 w-24 text-right font-bold">Priorité</th>
        </tr>
      </thead>
      
      <draggable
        v-model="list"
        tag="tbody"
        item-key="id"
        handle=".handle"
        ghost-class="bg-blue-50"
        class="divide-y divide-gray-200"
      >
        <template #item="{ element: projet }">
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-2 text-center text-gray-400 cursor-grab handle">
              ☰
            </td>
            
            <td class="px-4 py-2 font-medium text-gray-900 truncate">
              {{ projet.Titre || projet.title }}
            </td>
            
            <td class="px-4 py-2 text-xs">
              {{ projet.status || 'N/A' }}
            </td>
            
            <td class="px-4 py-2 text-right">
              <input
                v-model.number="projet.priorite"
                type="number"
                @input="handleInput"
                class="w-16 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded p-1 text-center focus:ring-1 focus:ring-blue-500"
              />
            </td>
          </tr>
        </template>
      </draggable>
    </table>
  </div>
</template>