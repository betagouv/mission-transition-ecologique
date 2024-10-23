<template>
  <p
    v-if="!manual"
    class="fr-tag"
  >
    {{ infos.tagLabel }}
  </p>
  <div v-else>
    <span class="fr-hint-text fr-text--white tee-font-style--italic">
      {{ infos.description }}
    </span>
    <DsfrSelect
      v-model="selectedActivity"
      :options="sectorOptions"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailActivity, Sector } from '@/types'

interface Props {
  infos: RegisterDetailActivity
  manual: boolean
}
const selectedActivity = defineModel<Sector>()
const sectorOptions = [
  {
    value: Sector.Craftsmanship,
    text: '👩‍🎨 J’ai une activité artisanale'
  },
  {
    value: Sector.Industry,
    text: '👩‍🔧 J’ai une activité industrielle, fabrication, production'
  },
  {
    value: Sector.Tourism,
    text: '🤵‍♂️ J’ai une activité de tourisme, restauration'
  },
  {
    value: Sector.Tertiary,
    text: '🧑‍⚖️ J’ai une activité tertiaire, de services'
  },
  {
    value: Sector.Agriculture,
    text: '👩‍🌾 J’ai une activité agricole'
  },
  {
    value: Sector.Other,
    text: "Je suis dans un autre secteur d'activité"
  }
]
defineProps<Props>()
</script>
