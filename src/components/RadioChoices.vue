<template>
  <!-- <DsfrRadioButtonSet
    :options="choices"
    >
    <template #legend>"Légende des champs"</template>
  </DsfrRadioButtonSet> -->
  <p
    v-for="btn in choices"
    :key="btn.value"
    >
    <DsfrButton
      :label="btn.label[tracks.lang]" 
      icon="ri-add-line"
      :secondary="true"
    />
  </p>
  <p class="fr-py-2v">
    <h4>
      debug choices 
      - tracks.lang : 
      <code>
        {{ tracks.lang }}
      </code>
    </h4>
  </p>
  <p class="fr-py-2v">
    <h4>
      debug / choices : 
    </h4>
    <code><pre>{{ choices  }}</pre></code>
  </p>
</template>

<script setup lang="ts">

import { tracksStore } from '@/stores/tracks'

interface Props {
  choices: object,
}
const props = defineProps<Props>()
const tracks = tracksStore()

</script>