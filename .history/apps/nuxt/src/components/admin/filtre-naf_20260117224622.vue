<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change', target.value)
}
</script>

<template>
  <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm max-w-2xl">
    <label for="naf-select" class="block text-sm font-semibold text-gray-700 mb-3">
      Filtrer par secteur d'activité (Code NAF)
    </label>

    <div class="relative max-w-md">
      <select id="naf-select"
        class="appearance-none block w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-white hover:border-blue-400 transition-all pr-10"
        @change="handleChange">
        <option value="">Tous les secteurs</option>
        <option value="85.59A">85.59A - Formation continue</option>
        <option value="94.99Z">94.99Z - Autres organisations</option>
        <option value="70.22Z">70.22Z - Conseil affaires</option>
        <option value="10.71Z">10.71Z - Boulangerie</option>
      </select>

      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  </div>
</template>