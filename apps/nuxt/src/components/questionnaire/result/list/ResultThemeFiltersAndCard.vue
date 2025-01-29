<template>
  <div class="fr-col-12">
    <div class="fr-grid-row fr-grid-row--center fr-mt-md-2w">
      <div class="fr-container fr-px-0 fr-px-md-3w">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-mt-3v">
          <ThemeFiltersAndCard :has-error="hasError" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  hasError: boolean
}
defineProps<Props>()
</script>
