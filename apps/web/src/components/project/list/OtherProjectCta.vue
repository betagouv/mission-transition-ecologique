<template>
  <TeeDsfrButton
    label="J'ai un autre projet"
    @click="openOtherProjectForm"
  />
</template>
<script setup lang="ts">
const openOtherProjectForm = () => {
  console.log('oui super')
}
</script>
