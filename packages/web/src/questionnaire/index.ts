import { needs } from './trackNeeds'
import { help } from './trackHelp'
import { siret } from './trackSiret'
import { workforce } from './trackStructureWorkforce'
// import { sizes } from './trackStructureSizes'
import { sectors } from './trackSectors'

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
import { energyStake } from './trackEnergyStake'

// import { status } from './trackStatus'

import { results } from './trackResults'

export const tracks = [
  needs,
  help,
  siret,
  // sizes,
  workforce,
  sectors,
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
  energyStake,

  results 
]
