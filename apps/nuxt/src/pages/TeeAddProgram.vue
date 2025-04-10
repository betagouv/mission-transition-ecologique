<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Ajouter une aide', to: { name: RouteName.AddProgram } }]" />
    <div
      id="simple-page"
      class="fr-container fr-mb-8w"
    >
      <iframe
        src="https://baserow.io/form/oZMzNirPXLXP8RpR2pQ553jFMVURknX_xVUl7B1bdl8"
        title="Formulaire Baserow d'ajout de dispositif"
        class="tee-baserow-form"
      ></iframe>
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types'

definePageMeta({
  path: '/ajouter-une-aide-entreprises',
  name: RouteName.AddProgram
})

useHead(MetaRobots.noIndexNoFollow())
</script>
<style lang="scss" scoped>
.tee-baserow-form {
  width: 100%;
  height: 100vh;
}
</style>
