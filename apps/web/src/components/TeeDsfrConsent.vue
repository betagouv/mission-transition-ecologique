<template>
  <div class="fr-consent-banner">
    <DsfrConsent
      :url="RouteName.PersonalData"
      @accept-all="onAcceptAll()"
      @refuse-all="onRefuseAll()"
    />
  </div>
</template>
<script setup lang="ts">
import { RouteName } from '@/types/routeType'

const onAcceptAll = () => {}
const onRefuseAll = () => {}
</script>
