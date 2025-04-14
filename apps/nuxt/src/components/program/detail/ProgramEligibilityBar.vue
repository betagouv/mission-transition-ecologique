<template>
  <TeeEligibilityBar
    :color="color"
    :bg-color="getEligibilityColor"
    :message="getEligibilityMessage"
    :link="getEligibilityLink"
    :message-detail="messageDetail"
  />
</template>
<script setup lang="ts">
import Translation from '@/tools/translation'
import { Color, ProgramEligibilityType, RouteName } from '@/types'
import { TeeEligibilityBarLink, TeeEligibilityBarMessage } from '@/components/program/eligibility/TeeEligibilityBar.vue'
import { useProgramStore } from '@/stores/program'
import { storeToRefs } from 'pinia'
import Program from '@/tools/program/program'

const { currentProgram: program } = storeToRefs(useProgramStore())

const isAvailable = Program.isAvailable(program.value)

const messageDetail = computed(() => {
  if (!isAvailable) {
    return Translation.t('program.programEndValidity') + ' : ' + program.value?.[`fin de validité`]
  }
  return undefined
})

const color = computed(() => {
  if (!isAvailable) {
    return Color.black
  }

  return undefined
})

const getEligibilityMessage: ComputedRef<TeeEligibilityBarMessage> = computed(() => {
  if (!isAvailable) {
    return {
      default: Translation.t('program.programNotAvailable'),
      mobile: Translation.t('program.programNotAvailable'),
      icon: 'fr-icon-information-line',
      role: 'alert'
    }
  }
  if (Program.isTemporaryUnavailable(program.value)) {
    return {
      default: 'Cette aide est temporairement indisponible.',
      mobile: 'Cette aide est temporairement indisponible.',
      icon: 'fr-icon-close-circle-fill',
      role: 'status'
    }
  }
  switch (program.value?.eligibility) {
    case ProgramEligibilityType.Eligible:
      return {
        default: 'Votre entreprise remplit les critères pour bénéficier de cette aide.',
        mobile: 'Vous entreprise peut prétendre à cette aide.',
        icon: 'fr-icon-checkbox-circle-fill',
        role: 'status'
      }
    case ProgramEligibilityType.PartiallyEligible:
      return {
        default: 'Votre entreprise semble éligible à cette aide.',
        mobile: 'Votre pouvez être éligible.',
        icon: 'fr-icon-checkbox-circle-fill',
        role: 'status'
      }
    case ProgramEligibilityType.NotEligible:
    default:
      return {
        default: "Oups, votre entreprise n'est pas éligible à cette aide.",
        mobile: "Vous n'êtes pas éligible",
        icon: 'fr-icon-close-circle-fill',
        role: 'alert'
      }
  }
})

const getEligibilityColor: ComputedRef<Color> = computed(() => {
  if (!isAvailable) {
    return Color.red
  }

  return Program.isTemporaryUnavailable(program.value)
    ? Color.red
    : program.value && [ProgramEligibilityType.NotEligible, ProgramEligibilityType.Unknown].includes(program.value.eligibility)
      ? Color.red
      : Color.greenLightnessed
})

const getEligibilityLink: ComputedRef<TeeEligibilityBarLink | undefined> = computed(() => {
  if (Program.isTemporaryUnavailable(program.value)) {
    return undefined
  }
  switch (program.value?.eligibility) {
    case ProgramEligibilityType.PartiallyEligible:
      return {
        hash: 'eligibilite',
        label: 'Voir les autres critères à respecter',
        labelMobile: 'Vérifier les critères'
      }
    case ProgramEligibilityType.NotEligible:
    case ProgramEligibilityType.Unknown:
      return {
        url: RouteName.CatalogPrograms,
        label: 'Voir les aides pour mon entreprise',
        labelMobile: 'Voir les aides éligibles',
        isButtonLink: true,
        callback: () => {
          useFiltersStore().setCompanyDataSelected(useCompanyDataStore().isDataFull)
        }
      }
    case ProgramEligibilityType.Eligible:
    default:
      return undefined
  }
})
</script>
