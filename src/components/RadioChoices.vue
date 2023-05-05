<template>
  <!-- <DsfrRadioButtonSet
    :options="choices"
    >
    <template #legend>"Légende des champs"</template>
  </DsfrRadioButtonSet> -->
  <p
    v-for="btn in choicesArray"
    :key="btn.value"
    >
    <DsfrButton
      :label="btn.label[choices.lang]" 
      :icon="`ri-${isActiveChoice(btn.value) ? 'check' : 'add'}-line`"
      :secondary="isActiveChoice(btn.value)"
      @click="updateChoice(btn.value)"
    />
  </p>

  <hr>

  <p class="fr-py-2v">
    <h4>
      RadioChoices debug / choices.lang : 
      <code>
        {{ choices.lang }}
      </code>
      - trackId : 
      <code>
        {{ trackId }}
      </code>
      - behavior : 
      <code>
        {{ behavior }}
      </code>
    </h4>
  </p>
  <p class="fr-py-2v">
    <h4>
      RadioChoices debug / choices.userChoices : 
    </h4>
    <code>
      {{ choices.userChoices }}
    </code>
  </p>
  <p class="fr-py-2v">
    <h4>
      RadioChoices debug / choicesArr : 
    </h4>
    <code><pre>{{ choicesArray  }}</pre></code>
  </p>
</template>

<script setup lang="ts">

import { tracksStore } from '@/stores/tracks'
import { choicesStore } from '@/stores/choices'

interface Props {
  behavior: string,
  trackId: string,
  choicesArray: object,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()

const isActiveChoice = (val: any) => {
  return choices.isActiveChoice(props.trackId, val)
}
const updateChoice = (val: any) => {
  const isActive = isActiveChoice(val)
  if (!isActive) {
    choices.updateUserChoice(props.trackId, val, false)
  } else {
    choices.updateUserChoice(props.trackId, val, true)
  }
}
</script>