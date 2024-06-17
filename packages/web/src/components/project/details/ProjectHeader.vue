<template>
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

interface Props {
  projectTitle: string | undefined
  projectImg: string | undefined
  color: string | undefined
}
defineProps<Props>()
const publicPath = Config.publicPath
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
