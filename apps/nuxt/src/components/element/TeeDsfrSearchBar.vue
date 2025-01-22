<template>
  <div>
    <div
      class="fr-input-group fr-mb-0"
      :class="errorMsg ? 'fr-input-group--error' : 'fr-input-group--valid'"
    >
      <div
        ref="localisationSearchBar"
        class="fr-search-bar fr-search-bar--yellow"
        :class="isLoading ? 'fr-search-bar--loading' : ''"
        role="search"
      >
        <DsfrInput
          v-model="localisationInput"
          :name="`manual-register-${name}`"
          class="fr-input--white fr-input"
          type="search"
          :placeholder="infos.description"
          @update:model-value="updateModelValue"
          @keyup.enter="searchLocalisation"
        />
        <DsfrButton
          class="fr-bg--yellow search-button"
          tertiary
          no-outline
          @click="searchLocalisation"
        />
      </div>
    </div>
    <div
      v-if="localisationResults.length && showResults"
      id="localisation-response"
      class="fr-bg--white"
    >
      <div
        v-for="localisation in localisationResults"
        :key="`resp-input-${localisation.nom}-${localisation.codePostal}`"
        class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
        @click="selectLocalisation(localisation)"
      >
        <div class="fr-card__body">
          <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
            <div class="fr-text--blue-france">{{ `${localisation.nom} (${localisation.codePostal}) ` }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="errorMsg ? 'fr-error-text' : ''"
      class="fr-input--empty-text fr-mt-2v"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  errorMsg: string
  name: string
}
defineProps<Props>()

const isLoading = ref<boolean>(false)
</script>
