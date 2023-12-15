<template>
  <div class="fr-mb-18v fr-mt-18v">
    <h2 class="fr-mb-3v">
      {{ choices.t('program.programAmIEligible') }}
    </h2>
    <hr class="fr-mb-4v" />
    <div v-for="(values, field, idx) in programEligibility" :key="`elegibility-field-${idx}`" class="fr-mb-8v fr-tee-eligigility">
      <h6 class="fr-tee-eligigility fr-mb-2v">
        <span class="fr-mr-1v">{{ eligilityEmojis[field] }}</span>
        {{ field[0].toUpperCase() + field.slice(1) }}
      </h6>
      <ul class="fr-tee-eligigility-list">
        <li v-for="(value, i) in values" :key="`elegibility-field-${idx}-value-${i}`">
          <!-- <span class="fr-icon-check-line"></span> -->
          {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramEligibility > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed } from 'vue'
import { choicesStore } from '@/stores/choices'
import type { ProgramData } from '@/types'

const eligilityEmojis = {
  "taille de l'entreprise": '🏢',
  'secteur géographique': '📍',
  "secteur d'activité": '👫',
  "nombre d'années d'activité": '🗓',
  "autres critères d'éligibilité": '💡'
}

interface Props {
  program: ProgramData
}

const props = defineProps<Props>()

const choices = choicesStore()

const programEligibility = computed(() => {
  return props.program["conditions d'éligibilité"]
})
</script>
