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
  <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <label
      for="naf-select"
      class="block text-sm font-semibold text-gray-700 mb-2"
    >
      Filtrer par secteur d'activité (Code NAF)
    </label>
    <select
      id="naf-select"
      class="block w-full md:w-1/3 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
      @change="handleChange"
    >
      <option value="">Tous les secteurs</option>
      <option value="85.59A">85.59A - Formation continue</option>
      <option value="94.99Z">94.99Z - Autres organisations</option>
      <option value="70.22Z">70.22Z - Conseil affaires</option>
      <option value="10.71Z">10.71Z - Boulangerie</option>
    </select>
  </div>
</template>
