<template>
  <div class="fr-col-12 fr-text-left">
    <div v-show="manual">
      <h4 class="fr-mb-0 fr-col-justify--left fr-py-2v fr-text--white">Quelle est votre entreprise ?</h4>
      <TeeDsfrButton
        label="je complète les informations avec mon SIRET"
        icon="fr-icon-arrow-left-line"
        class="fr-btn--tertiary-no-outline fr-p-0 fr-text--white fr-text--sm fr-text--underline"
        @click="openSiretStep"
      />
    </div>
    <RegisterDetailElement
      v-for="detail in details"
      v-show="detail.if !== false"
      :key="detail.title"
      class="fr-pb-8v register-element"
      :manual="manual"
      :detail-infos="detail"
      @modify-siret="openSiretStep"
      @update:model-value="updateSizeInfo"
    />
    <TeeDsfrButton
      class="fr-bg--yellow fr-text--blue-france"
      label="Enregistrer et fermer"
    />
  </div>
</template>
<script setup lang="ts">
import { EstablishmentFront, RegisterDetailType, RegisterDetails, StructureSize, RegisterProfile } from '@/types'

interface Props {
  company: EstablishmentFront | undefined
  manual: boolean
}
const props = defineProps<Props>()
const profileData = ref<RegisterProfile>({ establishment: props.company, size: undefined })
const emit = defineEmits(['modifySiret'])

const updateSizeInfo = (size: StructureSize) => {
  profileData.value.size = size
}

const openSiretStep = () => {
  emit('modifySiret')
}

const details: RegisterDetails[] = [
  {
    title: 'Votre SIRET',
    if: !props.manual,
    icon: 'fr-icon-account-pin-circle-line',
    type: RegisterDetailType.Siret,
    tagLabel: props.company ? `${props.company.denomination} - SIRET ${props.company.siret}` : ''
  },
  {
    title: 'Localisation',
    icon: 'fr-icon-map-pin-2-line',
    description: "Renseignez la région de votre lieu d'activités",
    type: RegisterDetailType.Localisation,
    tagLabel: props.company ? `${props.company.codePostal} ${props.company.ville}` : ''
  },
  {
    title: 'Activité',
    description: "Choisissez le secteur d'activité de votre entreprise",
    icon: 'fr-icon-briefcase-line',
    type: RegisterDetailType.Activity,
    tagLabel: props.company ? `${props.company.secteur} (${props.company.codeNAF})` : ''
  },
  {
    title: 'Effectif',
    icon: 'fr-icon-team-line',
    type: RegisterDetailType.Size,
    description: 'Choisissez la tranche correspondant à votre effectif'
  }
]
</script>
<style lang="scss" scoped>
.register-element {
  width: 30%;
}
</style>
