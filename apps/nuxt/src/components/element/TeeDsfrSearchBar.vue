<template>
  <div
    ref="teeSearchBar"
    class="search-bar"
  >
    <div
      class="fr-input-group fr-mb-0"
      :class="errorMsg ? 'fr-input-group--error' : 'fr-input-group--valid'"
    >
      <span
        v-if="hint"
        class="fr-hint-text fr-text--white fr-col-justify--left fr-mb-2v"
      >
        {{ hint }}
      </span>
      <div
        class="fr-search-bar"
        :class="`${isLoading ? 'fr-search-bar--loading' : ''} fr-search-bar--${color}`"
        role="search"
      >
        <DsfrInput
          v-model="inputModel"
          :name="`manual-register-${name}`"
          class="fr-input--white fr-input"
          type="search"
          :placeholder="placeholder"
          @click="emit('click')"
          @update:model-value="updateModelValue"
          @keyup.enter="emit('search')"
        />
        <DsfrButton
          :class="`fr-bg--${color}`"
          class="search-button"
          tertiary
          no-outline
          @click="emit('search')"
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
import { Color } from '@/types'

interface Props {
  errorMsg: string | undefined
  hint?: string
  isLoading: boolean
  name: string
  color: Color
  placeholder?: string | undefined
}

defineProps<Props>()

const inputModel = defineModel<string>()
const debouncedInputModel = useDebounce(inputModel, 1000)
const teeSearchBar = ref(null)
const emit = defineEmits(['resetSearch', 'search', 'click'])

const resetSearch = () => {
  inputModel.value = ''
  emit('resetSearch')
}
const updateModelValue = (value: string) => {
  inputModel.value = value
}
watch(debouncedInputModel, (newValue) => {
  if (newValue) {
    emit('search')
  }
})

onClickOutside(teeSearchBar, () => resetSearch())
</script>
<style lang="scss" scoped>
.search-bar {
  position: relative;
  margin-bottom: 0;
}
</style>
