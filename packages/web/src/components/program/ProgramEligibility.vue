<template>
  <div class="fr-mb-18v fr-mt-18v">
    <h2 class="fr-mb-3v">
      {{ choices.t('program.programAmIEligible') }}
    </h2>
    <hr class="fr-mb-4v" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div v-for="partIdx in 2" :key="`part-${partIdx}`" class="fr-col-6 fr-col-xs-12">
        <div v-for="(field, idx) in PartsOrder[partIdx - 1]" :key="`elegibility-field-part1-${idx}`" class="fr-mb-8v fr-tee-eligigility">
          <p class="fr-tee-eligigility-title fr-mb-1v">
            <span class="fr-mr-1v">{{ eligilityEmojis[field] }}</span>
            {{ field.toString()[0].toUpperCase() + field.toString().slice(1) }}
          </p>
          <ul class="fr-tee-eligigility-list fr-mt-1v">
            <li v-for="(value, i) in programEligibility[field]" :key="`elegibility-field-${idx}-value-${i}`">
              {{ value }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramEligibility > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed } from 'vue'
import { choicesStore } from '@/stores/choices'
import type { ProgramData } from '@/types'

interface Emojis {
  [key: string]: string
}
const eligilityEmojis: Emojis = {
  "taille de l'entreprise": '👫',
  'secteur géographique': '📍',
  "nombre d'années d'activité": '🗓',
  "secteur d'activité": '🏢',
  "autres critères d'éligibilité": '💡'
}

const PartsOrder = [
  ["taille de l'entreprise", 'secteur géographique', "nombre d'années d'activité"],
  ["secteur d'activité", "autres critères d'éligibilité"]
]

interface Props {
  program: ProgramData
}

const props = defineProps<Props>()

const choices = choicesStore()

const programEligibility: any = computed(() => {
  return props.program["conditions d'éligibilité"]
})
</script>
