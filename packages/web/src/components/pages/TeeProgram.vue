<template>
  <!-- TEE PROGRAM COMPONENT  -->
    <div
      class="fr-container--fluid fr-p-20v fr-my-20v "
      style="min-height: 800px">

      <!-- DEBUGGING -->
      <p>
        route.params.programId :
        <code>
          {{ route.params.programId }}
        </code>
      </p>
      <TeeProgramDetail
        :program-id="route.params.programId"
        :track-id="'track_results'"
        :track-element="trackElement"
        :debug="false"
        />
    </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router'

// @ts-ignore
import TeeProgramDetail from '../TeeProgramDetail.vue'

interface Props {
  trackElement: any,
  debug?: boolean,
}
const props = defineProps<Props>()

const route = useRoute()

</script>