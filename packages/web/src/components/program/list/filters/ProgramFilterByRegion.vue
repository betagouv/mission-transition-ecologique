<template>
  <DsfrCheckboxSet
    v-model="programFilters.regionAidSelected"
    :legend="legend"
    :options="programAidTypeOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'

interface Props {
  legend?: string
}
withDefaults(defineProps<Props>(), {
  legend: 'Région'
})
// note : based on authorized values in "/packages/data/common/interface.yaml"
const regionsList = [
  //France métropolitaine
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Pays de la Loire',
  'Île-de-France',

  //DOM
  'Guadeloupe',
  'Guyane',
  'La Réunion',
  'Martinique',
  'Mayotte',

  //Collectivités d'outre-mer
  'Ile de Clipperton',
  'Nouvelle-Calédonie',
  'Polynésie française',
  'Saint-Barthélemy',
  'Saint-Martin',
  'Saint-Pierre-Et-Miquelon',
  'Terres australes et antarctiques françaises',
  'Wallis et Futuna'
]
const programFilters: programFiltersType = useProgramStore().programFilters
const programAidTypeOptions: DsfrCheckboxSetProps['options'] = [
  {
    label: 'Accompagnement',
    id: ProgramAidType.acc,
    name: ProgramAidType.acc
  },
  {
    label: 'Financement',
    name: ProgramAidType.fund,
    id: ProgramAidType.fund
  },
  {
    label: 'Prêt',
    name: ProgramAidType.loan,
    id: ProgramAidType.loan
  },
  {
    label: 'Avantage fiscal',
    name: ProgramAidType.tax,
    id: ProgramAidType.tax
  },
  {
    label: 'Formation',
    id: ProgramAidType.train,
    name: ProgramAidType.train
  }
]
</script>
