<template>
  <TeeEligibilityBar
    :bg-color="getEligibilityColor"
    :message="getEligibilityMessage"
    :link="getEligibilityLink"
  />
</template>
<script setup lang="ts">
import { Color, type ProgramData as ProgramType, ProgramEligibilityType, RouteName } from '@/types'
import { TeeEligibilityBarLink, TeeEligibilityBarMessage } from '@/components/program/eligibility/TeeEligibilityBar.vue'
import Breakpoint from '@/utils/breakpoints'

const props = defineProps<{
  program: ProgramType | undefined
}>()

const getEligibilityMessage: ComputedRef<TeeEligibilityBarMessage> = computed(() => {
  switch (props.program?.eligibility) {
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
  return props.program?.eligibility === ProgramEligibilityType.NotEligible ? Color.red : Color.greenLightnessed
})

const getEligibilityLink: ComputedRef<TeeEligibilityBarLink | undefined> = computed(() => {
  switch (props.program?.eligibility) {
    case ProgramEligibilityType.PartiallyEligible:
      return {
        url: 'program-details-accordion-group',
        label: Breakpoint.isMobile() ? 'Vérifier les critères' : 'Voir les autres critères à respecter',
        isButton: false
      }
    case ProgramEligibilityType.NotEligible:
      return {
        url: RouteName.CatalogPrograms,
        label: Breakpoint.isMobile() ? 'Voir les aides éligibles' : 'Voir les aides pour mon entreprise',
        isButton: true
      }
    case ProgramEligibilityType.Eligible:
    default:
      return undefined
  }
})
</script>
