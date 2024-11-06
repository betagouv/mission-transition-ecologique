<template>
  <div
    v-show="manual"
    class="fr-col-sm-8 fr-col-md-5 fr-col-offset-md-2 fr-col-12"
  >
    <TeeDsfrButton
      size="small"
      class="fr-btn--tertiary-no-outline fr-text-left fr-p-0 fr-text--white fr-btn-bg fr-text--sm fr-text--underline"
      @click="openSiretStep"
    >
      <span class="fr-pr-2v fr-icon-arrow-left-line" /><span>je renseigne mon SIRET</span>
    </TeeDsfrButton>
    <h4 class="fr-mb-0 fr-py-2v fr-text--white">Quelle est votre entreprise ?</h4>
  </div>
  <TeeProfileElement
    v-for="detailKey in Object.keys(profile).filter((detailK) => profile[detailK].if !== false)"
    :key="profile[detailKey].title"
    v-model="profile[detailKey]"
    class="fr-pb-4v fr-col-sm-8 fr-col-md-5 fr-col-offset-md-2 fr-col-12"
    :manual="manual"
    :show-error="showError"
    :detail-infos="profile[detailKey]"
    @update:model-value="updateValue"
    @update:siret="openSiretStep"
  />
  <div class="fr-col-sm-8 fr-pt-4v fr-mt-4v fr-col-md-7 fr-col-offset-md-2 fr-col-12">
    <TeeDsfrButton
      :class="Breakpoint.isMobile() ? 'fr-btn-fullwidth' : ''"
      class="fr-bg--yellow fr-text--blue-france fr-col-justify--center"
      label="Enregistrer et fermer"
      @click="saveProfile"
    />
  </div>
</template>
<script setup lang="ts">
import { RegisterDetailType, RegisterDetails, Sector, CompanyDataStorageKey, CompanyDataType } from '@/types'
import Breakpoint from '@/utils/breakpoints'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import Navigation from '@/utils/navigation'

interface Props {
  company: CompanyDataType[CompanyDataStorageKey.Company]
  companySize: CompanyDataType[CompanyDataStorageKey.Size]
  manual: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['modifySiret', 'closeRegister'])
const showError = ref<boolean>(false)
const openSiretStep = () => {
  emit('modifySiret')
}
const profile = ref<RegisterDetails>({
  siret: {
    title: 'Votre SIRET',
    if: !props.manual,
    icon: 'fr-icon-account-pin-circle-line',
    value: props.company && 'siret' in props.company ? props.company.siret : undefined,
    type: RegisterDetailType.Siret,
    tagLabel: props.company?.denomination
  },
  localisation: {
    title: 'Localisation',
    icon: 'fr-icon-map-pin-2-line',
    description: 'Quelle est votre région ?',
    value: props.company?.region,
    type: RegisterDetailType.Localisation,
    tagLabel: props.manual && props.company && 'siret' in props.company ? `${props.company.codePostal} ${props.company.ville}` : ''
  },
  activity: {
    title: 'Activité',
    description: "Quel est votre secteur d'activités ?",
    icon: 'fr-icon-briefcase-line',
    value: props.company?.secteur as Sector,
    type: RegisterDetailType.Activity,
    tagLabel: props.company && props.company && 'siret' in props.company ? `${props.company.secteur} (${props.company.codeNAF})` : ''
  },
  size: {
    title: 'Effectif',
    icon: 'fr-icon-team-line',
    value: props.companySize,
    type: RegisterDetailType.Size,
    description: 'Combien êtes-vous dans votre entreprise ?'
  }
})
const canBeSaved = computed(() => {
  return props.manual ? profile.value.activity.value && profile.value.localisation.value && profile.value.size : profile.value.size.value
})

const saveProfile = () => {
  showError.value = false
  if (canBeSaved.value && profile.value.size.value) {
    const company = props.manual
      ? ({
          region: profile.value.localisation.value,
          secteur: profile.value.activity.value,
          denomination: `Entreprise : ${profile.value.activity.value} - ${profile.value.localisation.value}`
        } as CompanyDataType[CompanyDataStorageKey.Company])
      : props.company
    CompanyDataStorage.setCompany(company)
    CompanyDataStorage.setSize(profile.value.size.value)
    Navigation.toggleRegisterModal(false)
  } else {
    showError.value = true
  }
}
const updateValue = () => {
  showError.value = false
}
</script>
