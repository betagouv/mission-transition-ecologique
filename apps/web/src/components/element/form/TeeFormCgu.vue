<template>
  <div class="fr-col-12 fr-col-md-12">
    <DsfrCheckbox
      v-model="localField.value"
      name="cgu"
      :is-valid="localField.isValid"
      :required="localField.required"
      @update:model-value="validateFormField"
      @focusout="validateFormField"
    >
      <template #label>
        <span> {{ localField.label }} <code>*</code></span>
      </template>
    </DsfrCheckbox>
    <!-- CHECKBOX HINT -->
    <span class="fr-hint-text fr-mt-5v">
      Vos données à caractère personnel seront uniquement utilisées à des fins légitimes et nécessaires par l'équipe de Transition
      Écologique des Entreprises dans le respect du RGPD, c'est-à-dire pour vous recontacter par email ou par téléphone afin de vous aider à
      vous orienter et à vous conseiller dans votre recherche d'aides à la transition écologique de votre entreprise. Voir également nos
      <router-link
        :to="{ name: RouteName.PersonalData }"
        target="_blank"
      >
        Conditions Générales d'Utilisation
      </router-link>
      .
    </span>
  </div>
</template>
<script lang="ts" setup>
import { BooleanFieldInputType } from '@/types'
import { RouteName } from '@/types/routeType'

interface Props {
  field: BooleanFieldInputType
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'updateField', payload: BooleanFieldInputType): void }>()

const localField = ref<BooleanFieldInputType>(props.field)
const isFieldValid = (): boolean => {
  return localField.value.value !== false
}

const validateFormField = (): void => {
  localField.value.isValid = isFieldValid()
  emit('updateField', localField.value)
}
</script>
