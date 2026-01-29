import dotenv from 'dotenv'
import { AdemeDataManager } from '../externalProgram/ademe/ademeDataManager'
import { TempAdemeApi } from '../externalProgram/ademe/tmpAdemeApi'
import { ProgramAdemeBaserow } from '../common/baserow/programAdemeBaserow'
import { AdemeProgramBaserowToAbstractDto } from '../externalProgram/ademe/ademeProgramBaserowToAbstractDto'
import { AdemeToAdemeBaserowProgramDto } from '../externalProgram/ademe/ademeToAdemeBaserowProgramDto'

dotenv.config()

const main = async () => {
  const baserowApi = new ProgramAdemeBaserow()

  const ademeDataManager = new AdemeDataManager(
    new TempAdemeApi(),
    new AdemeToAdemeBaserowProgramDto(await baserowApi.getGeographicAreas()),
    baserowApi,
    new AdemeProgramBaserowToAbstractDto()
  )
  await ademeDataManager.updateData()
}

main()
  .then(() => {
    console.log('External data update completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('External data update failed:', error)
    process.exit(1)
  })
