<template>
  <div>
    <div
      class="fr-input-group fr-mb-0"
      :class="errorMsg ? 'fr-input-group--error' : 'fr-input-group--valid'"
    >
      <div
        ref="teeSearchBar"
        class="fr-search-bar fr-search-bar--yellow"
        :class="isLoading ? 'fr-search-bar--loading' : ''"
        role="search"
      >
        <DsfrInput
          v-model="inputModel"
          :name="`manual-register-${name}`"
          class="fr-input--white fr-input"
          type="search"
          :placeholder="placeholder"
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
    <slot name="results"></slot>
    <div
      :class="errorMsg ? 'fr-error-text' : ''"
      class="fr-input--empty-text fr-mt-2v"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside, useDebounce } from '@vueuse/core'

interface Props {
  errorMsg: string
  name: string
  placeholder: string | undefined
  search: Function
}

defineProps<Props>()

const isLoading = ref<boolean>(false)
const inputModel = defineModel<string>()
const debouncedInputModel = useDebounce(inputModel, 1000)
const teeSearchBar = ref(null)
const emit = defineEmits(['resetSearch'])

const resetSearch = () => {
  inputModel.value = ''
  emit('resetSearch')
}
const updateModelValue = (value: string) => {
  inputModel.value = value
}
watch(debouncedInputModel, (newValue) => {
  if (newValue) {
    searchLocalisation()
  }
})

onClickOutside(teeSearchBar, () => resetSearch())
</script>
