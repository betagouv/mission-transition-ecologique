<template>
  <TeeGroupBar
    :infos="criteria"
    full-line
    justify="left"
  />
</template>

<script setup lang="ts">
import TrackStructure from '@/tools/questionnaire/track/trackStructure'

const criteria = TrackStructure.getEligibilityCriteria()
</script>
