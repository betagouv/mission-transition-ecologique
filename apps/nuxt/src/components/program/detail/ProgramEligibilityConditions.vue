<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-for="partIdx in 2"
      :key="`part-${partIdx}`"
      class="fr-col-6 fr-col-xs-12"
    >
      <div
        v-for="(field, idx) in getFieldsForColumn(partIdx)"
        :key="`elegibility-field-part1-${idx}`"
        class="fr-mb-4v fr-text--purple"
      >
        <h4 class="fr-text--bold fr-mb-1v fr-text--purple fr-text--md">
          <span class="fr-mr-1v">{{ eligilityEmojis[field] }}</span>
          {{ field.toString()[0].toUpperCase() + field.toString().slice(1) }}
        </h4>
        <ul class="fr-pl-4w fr-mt-1v">
          <li
            v-for="(value, i) in programEligibility[field]"
            :key="`elegibility-field-${idx}-value-${i}`"
            class="fr-mb-0"
            v-html="Marked.toHtml(value)"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProgramTypeForFront } from '@/types'
import { Marked } from '@/tools/marked'

type EligibilityCategory = keyof ProgramTypeForFront["conditions d'éligibilité"]

type Emojis = Record<EligibilityCategory, string>

const eligilityEmojis: Emojis = {
  "taille de l'entreprise": '👫',
  'secteur géographique': '📍',
  "nombre d'années d'activité": '🗓',
  "secteur d'activité": '🏢',
  "autres critères d'éligibilité": '💡'
}

const order: EligibilityCategory[] = [
  "taille de l'entreprise",
  'secteur géographique',
  "nombre d'années d'activité",
  "secteur d'activité",
  "autres critères d'éligibilité"
]

const splitInTwo = (fields: EligibilityCategory[]): [EligibilityCategory[], EligibilityCategory[]] => {
  const mid: number = Math.ceil(fields.length / 2)
  return [fields.slice(0, mid), fields.slice(mid)]
}

const getFieldsForColumn = (columnNumber: number): EligibilityCategory[] => {
  const columns = splitInTwo(order.filter((field) => !!programEligibility.value[field]))
  return columns[columnNumber - 1]
}

interface Props {
  program: ProgramTypeForFront
}
const props = defineProps<Props>()

const programEligibility = computed(() => {
  return props.program["conditions d'éligibilité"]
})
</script>
