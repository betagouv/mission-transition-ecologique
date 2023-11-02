import { needs } from './trackNeeds'
import { help } from './trackHelp'
import { siret } from './trackSiret'
import { workforce } from './trackStructureWorkforce'
// import { sizes } from './trackStructureSizes'
import { trackSectors } from './trackSectors'

import { goals } from './trackGoals'
import { roles } from './trackRoles'

import { buildingProperty } from './trackBuildingProperty'
import { buildingSurface } from './trackBuildingSurface'
import { mobility } from './trackMobility'
import { mobilityNumberVehicles } from './trackMobilityNumberVehicles'
import { mobilityEnergy } from './trackMobilityEnergy'
import { wastesStake } from './trackWastesStake'
import { wastesSorting } from './trackWastesSorting'
import { wastesMaterials } from './trackWastesMaterials'
import { waterStake } from './trackWaterStake'
// import { energyTypes } from './trackEnergyTypes'
import { energyReductionPriority } from './trackEnergyReduction'
import { strategyAudits } from './trackStrategyAudits'
import { strategyAuditsSelect } from './trackStrategyAuditsSelect'

// import { status } from './trackStatus'

import { results } from './trackResults'
import type { Track } from '@/types'

export const tracks: Track[] = [
  needs,
  help,
  siret,
  // sizes,
  workforce,
  trackSectors,
  // status,
  goals,
  roles,

  buildingProperty,
  buildingSurface,
  mobility,
  mobilityNumberVehicles,
  mobilityEnergy,
  wastesStake,
  wastesSorting,
  wastesMaterials,
  waterStake,
  energyReductionPriority,
  // energyTypes,
  strategyAudits,
  strategyAuditsSelect,

  results
]
