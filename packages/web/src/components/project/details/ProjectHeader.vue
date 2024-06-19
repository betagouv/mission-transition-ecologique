<template>
  <TeeEligibilityCriteriaBar
    :bg-color="Color.blueLightnessed"
    :bg-bar-color="Color.blueLighted"
    :previous-route="routeToProjects"
    message=""
    message-icon=""
  />
  <div class="backgroundProjectTitle">
    <img
      :src="`${publicPath}${projectImg}`"
      :alt="`image / ${projectTitle}`"
    />
    <div
      class="fr-h1 fr-mb-4v fr-text-center projectTitle"
      :style="{ '--gradient-color': color }"
    >
      {{ projectTitle }}
    </div>
  </div>
</template>
<script setup lang="ts">
import Config from '@/config'
import TrackStructure from '@/utils/track/trackStructure'
import { Color } from '@/types'
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  projectTitle: string | undefined
  projectId: string | undefined
  projectImg: string | undefined
  color: string | undefined
}
const props = defineProps<Props>()
const publicPath = Config.publicPath
const siret: undefined | string = TrackStructure.getSiret()
const navigationStore = useNavigationStore()

const routeToProjects = {
  name: RouteName.QuestionnaireResult,
  hash: '#' + props.projectId,
  query: navigationStore.query
}
console.log(siret)
</script>

<style scoped>
.backgroundProjectTitle {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.backgroundProjectTitle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.projectTitle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: end;
  background-image: linear-gradient(to bottom, transparent, var(--gradient-color));
  justify-content: center;
}
</style>
