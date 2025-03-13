import { siret } from './trackStructureSiret'
import { workforce } from './trackStructureWorkforce'
import { sectors } from './trackStructureSectors'
import { regions } from './trackStructureRegion'
import { goals } from './trackGoals'
import { buildingProperty } from './trackBuildingProperty'
import { mobilityWishes } from './trackMobilityWishes'
import { wastesStake } from './trackWastesStake'
import { wastesSorting } from './trackWastesSorting'
import { wastesMaterials } from './trackWastesMaterials'
import { waterStake } from './trackWaterStake'
import { energyReductionPriority } from './trackEnergyReduction'
import { strategyAudits } from './trackStrategyAudits'
import { strategyAuditsSelect } from './trackStrategyAuditsSelect'
import type { Track } from '@/types'

export const tracks: Track[] = [
  siret,
  workforce,
  sectors,
  regions,
  goals,
  buildingProperty,
  mobilityWishes,
  wastesStake,
  wastesSorting,
  wastesMaterials,
  waterStake,
  energyReductionPriority,
  strategyAudits,
  strategyAuditsSelect
]
