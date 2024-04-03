import type { Track } from '@/types'
import { TrackComponent, TrackId } from '@/types'

export enum StrategyAuditsSelect {
  CarbonAudit = 'carbon_audit',
  EnergeticPerformanceAudit = 'energetic_performance_audit',
  EnergyConsumptionAudit = 'energy_consumption_audit',
  WaterAudit = 'water_audit',
  WastesAudit = 'wastes_audit',
  RawMaterialsAudit = 'raw_materials_audit',
  Certification = 'certification',
  Other = 'other',
  Unknown = 'unknown'
}

export const strategyAuditsSelect: Track = {
  id: TrackId.StrategyAuditsSelect,
  category: 'myStrategy',
  title: { fr: 'Quels audits' },
  label: { fr: 'Le ou lesquels ?' },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: white;',
    bgColor: '#646EFA',
    title: { fr: 'Votre stratégie environnementale' },
    titleStyle: 'color: white;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-strategie.svg'
  },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: true
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: StrategyAuditsSelect.CarbonAudit,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.CarbonAudit
      },
      title: { fr: 'Oui' },
      label: { fr: '🌱 Bilan de gaz à effet de serre ou bilan carbone' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.EnergeticPerformanceAudit,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.EnergeticPerformanceAudit
      },
      title: { fr: 'Performance énergétique' },
      label: { fr: '⚡️ Audit de performance énergétique des bâtiments ou Certification ISO 50001' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.EnergyConsumptionAudit,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.EnergyConsumptionAudit
      },
      title: { fr: "Consommation d'énergie" },
      label: { fr: '⚡️ Audit consommation d’énergie' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.WaterAudit,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.WaterAudit
      },
      title: { fr: 'Eau' },
      label: { fr: '💧 Audit eau' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.WastesAudit,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.WastesAudit
      },
      title: { fr: 'Déchets' },
      label: { fr: '🗑 Audit déchets' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.RawMaterialsAudit,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.RawMaterialsAudit
      },
      title: { fr: 'Matières premières' },
      label: { fr: '🧱 Audit matières premières' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.Certification,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.Certification
      },
      title: { fr: 'Certification' },
      label: { fr: '🎖 Certification ISO 14001 ' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.Other,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.Other
      },
      title: { fr: 'Autre' },
      label: { fr: 'Autre' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: StrategyAuditsSelect.Unknown,
      questionnaireData: {
        recent_audits: StrategyAuditsSelect.Unknown
      },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
