<template>
  <div class="fr-col-10 fr-col-offset-sm-2">
    <div v-show="manual">
      <h4 class="fr-mb-0 fr-col-justify--left fr-py-2v fr-text--white">Quelle est votre entreprise ?</h4>
      <TeeDsfrButton
        class="fr-btn--tertiary-no-outline fr-p-0 fr-text--white fr-btn-bg fr-text--sm fr-text--underline"
        @click="openSiretStep"
      >
        <template #text>
          <span class="fr-icon--lg fr-pr-2v fr-icon-arrow-left-line" /><span>je complète les informations avec mon SIRET</span>
        </template>
      </TeeDsfrButton>
    </div>
    <TeeProfileElement
      v-for="detailKey in Object.keys(profile)"
      v-show="profile[detailKey].if !== false"
      :key="profile[detailKey].title"
      v-model="profile[detailKey]"
      class="fr-pb-4v fr-col-sm-8 fr-col-md-6 fr-col-12"
      :manual="manual"
      :detail-infos="profile[detailKey]"
      @update:model-value="(v: RegisterDetailUnion) => (profile[detailKey] = v)"
      @update:siret="openSiretStep"
    />
    <TeeDsfrButton
      class="fr-bg--yellow fr-text--blue-france"
      label="Enregistrer et fermer"
      :disabled="isSaveDisabled"
      @click="saveProfile"
    />
  </div>
</template>
<script setup lang="ts">
import { EstablishmentFront, RegisterDetailType, RegisterDetailUnion, RegisterDetails, Sector, StructureSize } from '@/types'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'

interface Props {
  company: EstablishmentFront | null
  companySize: StructureSize | null
  manual: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['modifySiret', 'closeRegister'])

const openSiretStep = () => {
  emit('modifySiret')
}
const profile = ref<RegisterDetails>({
  siret: {
    title: 'Votre SIRET',
    if: !props.manual,
    icon: 'fr-icon-account-pin-circle-line',
    value: props.company?.siret,
    type: RegisterDetailType.Siret,
    tagLabel: props.company ? `${props.company.denomination} - SIRET ${props.company.siret}` : ''
  },
  localisation: {
    title: 'Localisation',
    icon: 'fr-icon-map-pin-2-line',
    description: "Renseignez la région de votre lieu d'activités",
    value: props.company?.region,
    type: RegisterDetailType.Localisation,
    tagLabel: props.company ? `${props.company.codePostal} ${props.company.ville}` : ''
  },
  activity: {
    title: 'Activité',
    description: "Choisissez le secteur d'activité de votre entreprise",
    icon: 'fr-icon-briefcase-line',
    value: props.company?.secteur as Sector,
    type: RegisterDetailType.Activity,
    tagLabel: props.company ? `${props.company.secteur} (${props.company.codeNAF})` : ''
  },
  size: {
    title: 'Effectif',
    icon: 'fr-icon-team-line',
    value: props.companySize,
    type: RegisterDetailType.Size,
    description: 'Choisissez la tranche correspondant à votre effectif'
  }
})
const isSaveDisabled = computed(() => {
  const { localisation, activity, size } = profile.value
  return props.manual ? !localisation.value || !activity.value || !size.value : !size.value
})
const saveProfile = () => {
  if (!props.manual && props.company && profile.value.size.value) {
    CompanyDataStorage.setSiret(props.company)
    CompanyDataStorage.setSize(profile.value.size.value)
  }
  emit('closeRegister')
  console.log('profile', profile.value)
}
</script>
