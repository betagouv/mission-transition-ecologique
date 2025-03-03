<template>
  <div>
    <div
      class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
      style="min-height: 800px"
    >
      <CatalogProjects />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.CatalogProjects,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const route = useRoute()

if (route.query['profil-entreprise'] === 'oui' && !CompanyData.hasCompanyData()) {
  Navigation.toggleRegisterModal()
}
</script>
