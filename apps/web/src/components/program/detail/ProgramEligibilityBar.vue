<template>
  <TeeEligibilityBar
    :bg-color="getEligibilityColor"
    :message="getEligibilityMessage"
    :link="getEligibilityLink"
  />
</template>
<script setup lang="ts">
import { Color, ProgramEligibilityType } from '@/types'
import { TeeEligibilityBarLink, TeeEligibilityBarMessage } from '@/components/program/eligibility/TeeEligibilityBar.vue'
import { useProgramStore } from '@/stores/program'
import { storeToRefs } from 'pinia'

const { currentProgram: program } = storeToRefs(useProgramStore())

const getEligibilityMessage: ComputedRef<TeeEligibilityBarMessage> = computed(() => {
  switch (program.value?.eligibility) {
    case ProgramEligibilityType.Eligible:
      return {
        default: 'Votre entreprise remplit les critères pour bénéficier de cette aide.',
        mobile: 'Vous entreprise peut prétendre à cette aide.',
        icon: 'fr-icon-checkbox-circle-fill'
      }
    case ProgramEligibilityType.PartiallyEligible:
      return {
        default: 'Votre entreprise semble éligible à cette aide.',
        mobile: 'Votre pouvez être éligible.',
        icon: 'fr-icon-checkbox-circle-fill'
      }
    case ProgramEligibilityType.NotEligible:
    default:
      return {
        default: "Oups, votre entreprise n'est pas éligible à cette aide.",
        mobile: "Vous n'êtes pas éligible",
        icon: 'fr-icon-close-circle-fill'
      }
  }
})

const getEligibilityColor: ComputedRef<Color> = computed(() => {
  return program.value?.eligibility === ProgramEligibilityType.NotEligible ? Color.red : Color.greenLightnessed
})

const getEligibilityLink: ComputedRef<TeeEligibilityBarLink | undefined> = computed(() => {
  switch (program.value?.eligibility) {
    case ProgramEligibilityType.PartiallyEligible:
      return {
        hash: 'program-details-accordion-group',
        label: 'Voir les autres critères à respecter',
        labelMobile: 'Vérifier les critères'
      }
    //TODO décommenter quand le filtrage du catalogue est opérationnel
    // return {
    //   url: RouteName.CatalogPrograms,
    //   label: 'Voir les aides pour mon entreprise',
    //   labelMobile: 'Voir les aides éligibles',
    //   isButtonLink: true
    // }
    case ProgramEligibilityType.NotEligible:
    case ProgramEligibilityType.Eligible:
    default:
      return undefined
  }
})
</script>
