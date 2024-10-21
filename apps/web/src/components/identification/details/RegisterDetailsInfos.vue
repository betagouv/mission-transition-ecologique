<template>
  <div class="fr-col-12 fr-text-left">
    <RegisterDetailElement
      v-for="detail in details"
      :key="detail.title"
      class="fr-pb-8v"
      :detail-infos="detail"
      @modify-field="openModifyField"
      @update:model-value="updateSizeInfo"
    />
    <TeeDsfrButton
      class="fr-bg--yellow fr-text--blue-france"
      label="Enregistrer et fermer"
    />
  </div>
</template>
<script setup lang="ts">
import { EstablishmentFront, RegisterDetailType, RegisterDetails, FieldType, StructureSize, RegisterProfile } from '@/types'

interface Props {
  company: EstablishmentFront
}
const props = defineProps<Props>()
const profileData = ref<RegisterProfile>({ establishment: props.company, size: undefined })
const emit = defineEmits(['modifySiret'])

const updateSizeInfo = (size: StructureSize) => {
  profileData.value.size = size
}

const openModifyField = (type: RegisterDetailType) => {
  if (type === RegisterDetailType.Siret) {
    emit('modifySiret')
  }
}

const details: RegisterDetails[] = [
  {
    title: 'Votre SIRET',
    icon: 'fr-icon-account-pin-circle-line',
    type: RegisterDetailType.Siret,
    tagLabel: `${props.company.denomination} - SIRET ${props.company.siret} `,
    fieldType: FieldType.Tag,
    editable: true
  },
  {
    title: 'Localisation',
    icon: 'fr-icon-map-pin-2-line',
    type: RegisterDetailType.Localisation,
    tagLabel: `${props.company.codePostal} ${props.company.ville}`,
    fieldType: FieldType.Tag,
    editable: false
  },
  {
    title: 'Activité',
    icon: 'fr-icon-briefcase-line',
    type: RegisterDetailType.Activity,
    tagLabel: `${props.company.secteur} (${props.company.codeNAF})`,
    fieldType: FieldType.Tag,
    editable: false
  },
  {
    title: 'Effectif',
    icon: 'fr-icon-team-line',
    type: RegisterDetailType.Size,
    fieldType: FieldType.Select,
    editable: true,
    selectOptions: {
      description: 'Choisissez la tranche correspondant à votre effectif',
      errorMessage: "La sélection de l'effectif est nécessaire",
      options: [
        {
          value: StructureSize.EI,
          text: '‍️🧍Je suis un entrepreneur individuel'
        },
        {
          value: StructureSize.TPE,
          text: '‍️👫 Moins de 20 employés'
        },
        {
          value: StructureSize.PE,
          text: '‍️👫👫 Entre 20 et 49 employés'
        },
        {
          value: StructureSize.ME,
          text: '‍️👫👭👫 Entre 50 et 250 employés'
        },
        {
          value: StructureSize.ETI_GE,
          text: '👫👭👫👫 Plus de 250 employés'
        }
      ]
    }
  }
]
</script>
