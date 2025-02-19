import { PhoneValidator, EmailValidator, SiretValidator, OpportunityType, EstablishmentFront } from '@tee/common'
import { FieldType, RouteName, ProgramType, ProjectType, FormDataType, ThemeType, ThemeId } from '@/types'
import TrackStructure from '@/tools/questionnaire/track/trackStructure'
import { CalloutType } from '@/types/elementsPropsTypes'
import Translation from '@/tools/translation'
import { Theme } from '@/tools/theme'
import { CompanyData } from '@/tools/companyData'
import { useFiltersStore } from '@/stores/filters'

export default class Opportunity {
  static getBaseOpportunityFormFields(): FormDataType {
    const selectedThemeId = useFiltersStore().hasThemeTypeSelected() ? useFiltersStore().getThemeTypeSelected() : TrackStructure.getTheme()
    const selectedTheme = Theme.getById(selectedThemeId as ThemeId)
    return {
      theme: {
        required: false,
        hidden: true,
        options: Theme.themes.map((theme: ThemeType) => theme.tagLabel),
        value: selectedTheme?.tagLabel,
        label: 'Thématique',
        isValid: true,
        type: FieldType.Select
      },
      name: { required: true, colSize: 6, type: FieldType.Text, value: undefined, label: 'Prénom', isValid: undefined },
      surname: { required: true, colSize: 6, type: FieldType.Text, value: undefined, label: 'Nom', isValid: undefined },
      email: {
        required: true,
        type: FieldType.Email,
        isValid: undefined,
        value: undefined,
        label: 'Email',
        hint: 'Format attendu : nom@domaine.fr',
        validation: EmailValidator.validate,
        errorMessage: "L'adresse email n'est pas valide."
      },
      tel: {
        required: true,
        isValid: undefined,
        type: FieldType.Tel,
        value: undefined,
        label: 'Téléphone',
        hint: 'Format attendu : 01 22 33 44 55',
        validation: PhoneValidator.validate,
        errorMessage: "Le numéro de téléphone n'est pas valide."
      },
      siret: {
        required: true,
        type: FieldType.Text,
        isValid: undefined,
        value: CompanyData.company ? (CompanyData.company as EstablishmentFront).siret : '',
        label: 'SIRET de votre entreprise',
        hint: 'Format attendu : 14 chiffres',
        validation: SiretValidator.validate,
        errorMessage: "Le numéro SIRET n'est pas valide."
      },
      needs: {
        required: true,
        type: FieldType.Textarea,
        isValid: undefined,
        label: 'Quel est votre besoin ?',
        value: '',
        hint: undefined,
        wrapperClass: 'fr-m-0',
        rows: 10,
        callOut: {
          type: CalloutType.FormInput,
          content:
            "Pour vous aider au mieux, nos conseillers ont besoin d'éléments de contexte.\n" +
            'N’hésitez pas à nous détailler votre projet, vos besoins ou vos questionnements.',
          img: '/images/TEE-conseiller.svg'
        }
      },
      cgu: {
        required: true,
        type: FieldType.Checkbox,
        isValid: undefined,
        value: false,
        label: "J'accepte d'être recontacté par l'équipe de Transition Écologique des Entreprises",
        hintLink: {
          route: RouteName.PersonalData,
          text: "Conditions Générales d'Utilisation"
        },
        hint: "Vos données à caractère personnel seront uniquement utilisées à des fins légitimes et nécessaires par l'équipe de Transition Écologique des Entreprises dans le respect du RGPD, c'est-à-dire pour vous recontacter par email ou par téléphone afin de vous aider à vous orienter et à vous conseiller dans votre recherche d'aides à la transition écologique de votre entreprise. Voir également nos"
      }
    }
  }
  static getProjectFormFields(project: ProjectType): FormDataType {
    const baseFields = this.getBaseOpportunityFormFields()
    baseFields.needs.value = Translation.t('project.form.needs', { secteur: TrackStructure.getSector() })
    return {
      projectTitle: {
        required: true,
        value: project.title,
        label: 'Quel est votre projet?',
        isValid: true,
        type: FieldType.Text
      },
      ...baseFields
    }
  }
  static getOtherProjectFormFields(): FormDataType {
    const baseFields = this.getBaseOpportunityFormFields()
    baseFields.needs.label = 'Quel est votre projet ?'
    baseFields.needs.value = Translation.t('otherProject.form.needs', { secteur: TrackStructure.getSector() })
    baseFields.theme = { ...baseFields.theme, hidden: false, required: true }
    return {
      projectTitle: {
        required: true,
        value: undefined,
        label: 'Quel est le nom de votre projet?',
        isValid: undefined,
        type: FieldType.Text
      },
      ...baseFields
    }
  }
  static getProgramFormFields(program: ProgramType): FormDataType {
    const baseFields = this.getBaseOpportunityFormFields()
    baseFields.needs.value = Translation.t('program.form.needs', {
      secteur: TrackStructure.getSector(),
      titreAide: program.titre
    })
    return baseFields
  }

  static isCustomProject(opportunityType: OpportunityType): boolean {
    return opportunityType === OpportunityType.CustomProject
  }
}
