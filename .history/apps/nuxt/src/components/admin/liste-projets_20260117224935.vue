<script setup lang="ts">
import type { DataProject } from '@tee/data'
import draggable from 'vuedraggable'

const props = defineProps<{
  projets: DataProject[]
}>()

const emit = defineEmits(['update:projets'])

const list = computed({
  get: () => props.projets,
  set: (value) => emit('update:projets', value)
})
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <table class="w-full text-sm text-left text-gray-500 table-fixed">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
        <tr>
          <th scope="col" class="px-4 py-3 w-12 text-center">Tri</th>
          <th scope="col" class="px-4 py-3 w-auto font-bold">Nom du Projet</th>
          <th scope="col" class="px-4 py-3 w-28">Status</th>
          <th scope="col" class="px-4 py-3 w-28 text-right font-bold">Priorité</th>
        </tr>
      </thead>

      <draggable v-model="list" tag="tbody" item-key="id" handle=".handle" ghost-class="bg-blue-50"
        class="divide-y divide-gray-200">
        <template #item="{ element: projet }">
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-2 text-center text-gray-400 cursor-grab handle">☰</td>
            <td class="px-4 py-2 font-medium text-gray-900 truncate">{{ projet.Titre || projet.title }}</td>
            <td class="px-4 py-2">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-medium"
                :class="projet.status === 'En prod' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ projet.status || 'N/A' }}
              </span>
            </td>
            <td class="px-4 py-2 text-right">
              <span class="text-xs font-mono text-gray-400">#{{ projet.priorite }}</span>
            </td>
          </tr>
        </template>
      </draggable>
    </table>
  </div>
</template>