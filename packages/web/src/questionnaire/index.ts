import { needs } from './trackNeeds'
import { questionnaireRoute } from './trackQuestionnaireRoute'

import { siret } from './trackStructureSiret'
import { workforce } from './trackStructureWorkforce'
// import { sizes } from './trackStructureSizes'
import { sectors } from './trackStructureSectors'
import { regions } from './trackStructureRegion'

import { goals } from './trackGoals'
import { roles } from './trackRoles'

import { buildingProperty } from './trackBuildingProperty'
import { buildingSurface } from './trackBuildingSurface'
import { mobilityWishes } from './trackMobilityWishes'
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
  questionnaireRoute,
  siret,
  // sizes,
  workforce,
  sectors,
  regions,

  // status,
  goals,
  roles,

  buildingProperty,
  buildingSurface,
  mobilityWishes,
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
