import { SizeToText, Track, TrackCategory } from '@/types'
import { TrackComponent, TrackId, StructureSize } from '@/types'

export const workforce: Track = {
  id: TrackId.StructureWorkforce,
  category: TrackCategory.MyEntreprise,
  title: { fr: 'Mes effectifs' },
  label: { fr: 'Combien êtes-vous dans votre entreprise ?' },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: StructureSize.EI,
      questionnaireData: { structure_size: StructureSize.EI },
      title: { fr: SizeToText[StructureSize.EI].title },
      label: { fr: SizeToText[StructureSize.EI].label },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      value: StructureSize.MICRO,
      questionnaireData: { structure_size: StructureSize.MICRO },
      title: { fr: SizeToText[StructureSize.MICRO].title },
      label: { fr: SizeToText[StructureSize.MICRO].label },
      next: {
        default: TrackId.Sectors
      }
    },

    {
      value: StructureSize.TPE,
      questionnaireData: { structure_size: StructureSize.TPE },
      title: { fr: SizeToText[StructureSize.TPE].title },
      label: { fr: SizeToText[StructureSize.TPE].label },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      value: StructureSize.PE,
      questionnaireData: { structure_size: StructureSize.PE },
      title: { fr: SizeToText[StructureSize.PE].title },
      label: { fr: SizeToText[StructureSize.PE].label },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      value: StructureSize.ME,
      questionnaireData: { structure_size: StructureSize.ME },
      title: { fr: SizeToText[StructureSize.ME].title },
      label: { fr: SizeToText[StructureSize.ME].label },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      value: StructureSize.ETI,
      questionnaireData: { structure_size: StructureSize.ETI },
      title: { fr: SizeToText[StructureSize.ETI].title },
      label: { fr: SizeToText[StructureSize.ETI].label },
      next: {
        default: TrackId.Sectors
      }
    },
    {
      value: StructureSize.GE,
      questionnaireData: { structure_size: StructureSize.GE },
      title: { fr: SizeToText[StructureSize.GE].title },
      label: { fr: SizeToText[StructureSize.GE].label },
      next: {
        default: TrackId.Sectors
      }
    }
  ]
}
