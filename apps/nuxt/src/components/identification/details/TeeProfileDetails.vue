<template>
  <div
    v-show="manual"
    class="fr-col-sm-8 fr-col-md-5 fr-col-offset-md-2 fr-col-12"
  >
    <TeeDsfrButton
      size="small"
      class="fr-btn--tertiary-no-outline fr-text-left fr-p-0 fr-text--white fr-btn-bg fr-text--sm fr-text--decoration-underline"
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
    class="fr-col-sm-8 fr-col-md-5 fr-col-offset-md-2 fr-col-12"
    :manual="manual"
    :show-error="showError"
    :detail-infos="profile[detailKey]"
    @update:model-value="updateValue"
    @update:siret="openSiretStep"
  />
  <div class="fr-col-sm-8 fr-pt-4v fr-col-md-7 fr-col-offset-md-2 fr-col-12">
    <TeeDsfrButton
      :class="Breakpoint.isMobile() ? 'fr-btn-fullwidth' : ''"
      class="fr-bg--yellow fr-text--blue-france fr-col-justify--center"
      label="Enregistrer et fermer"
      @click="saveProfile"
    />
  </div>
</template>
<script setup lang="ts">
import { ProgramManager } from '@/tools/program/programManager'
import { ProjectManager } from '@/tools/project/projectManager'
import {
  RegisterDetailType,
  RegisterDetails,
  CompanyDataStorageKey,
  CompanyDataType,
  Region,
  EstablishmentFront,
  NAF1,
  RouteName
} from '@/types'
import Analytics from '@/tools/analytic/analytics'
import Breakpoint from '@/tools/breakpoints'
import Navigation from '@/tools/navigation'
import { CompanyData } from '@/tools/companyData'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'

const router = useRouter()
const navigation = new Navigation()

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
    tagLabel: props.company?.denomination || 'Entreprise'
  },
  localisation: {
    title: 'Localisation',
    icon: 'fr-icon-map-pin-2-line',
    description: 'Quelle est votre ville ?',
    value: props.company
      ? {
          ville: props.company.ville,
          region: props.company.region as Region,
          codePostal: props.company.codePostal
        }
      : undefined,
    type: RegisterDetailType.Localisation,
    tagLabel: props.company && 'siret' in props.company ? `${props.company.codePostal} ${props.company.ville}` : ''
  },
  activity: {
    title: 'Activité',
    description: "Quel est votre secteur d'activité ?",
    icon: 'fr-icon-briefcase-line',
    value: props.company
      ? { secteur: props.company.secteur, codeNAF: props.company.codeNAF, codeNAF1: props.company.codeNAF1 as NAF1 }
      : undefined,
    type: RegisterDetailType.Activity,
    tagLabel: props.company ? `${props.company.secteur} (${props.company.codeNAF})` : ''
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
  return profile.value.activity.value && profile.value.localisation.value && profile.value.size.value
})

const saveProfile = async () => {
  showError.value = false
  if (canBeSaved.value && profile.value.size.value) {
    const companyData = props.manual
      ? CompanyData.getManualCompanyData(profile.value)
      : CompanyData.getSiretBasedCompanyData(props.company, profile.value)

    CompanyData.saveAndSetUsedTrackStore({
      [CompanyDataStorageKey.Company]: companyData,
      [CompanyDataStorageKey.Size]: profile.value.size.value
    })
    CompanyData.updateRouteFromStorage()
    if (!props.manual) {
      const companyData = CompanyData.company as EstablishmentFront
      if (companyData) {
        Analytics.sendEvent('register_siret_modal', {
          secteur: companyData.secteur,
          siret: companyData.siret
        })
      }
    } else {
      Analytics.sendEvent('register_manual_modal')
    }

    await UsedTrack.updateQuestionnaireStep()
    await new ProjectManager().update()
    await new ProgramManager().update()

    if (navigation.isByRouteName(RouteName.Homepage) && useNavigationStore().isFromCtaRegisterModal) {
      useNavigationStore().isFromCtaRegisterModal = false
      await router.push({
        name: RouteName.CatalogProjects
      })
    }
    Navigation.toggleRegisterModal(false)
  } else {
    showError.value = true
  }
}
const updateValue = () => {
  showError.value = false
}
</script>
