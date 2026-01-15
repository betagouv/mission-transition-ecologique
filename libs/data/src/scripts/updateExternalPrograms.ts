import { AdemeDataManager } from '../externalProgram/ademe/ademeDataManager'
import { TempAdemeApi } from '../externalProgram/ademe/tmp_to_commit/tmpAdemeApi'
import { AdemeToDataProgramConverter } from '../externalProgram/ademe/tmp_to_commit/tmpAdemeToDataProgramConverter'
import { ProgramAdemeBaserow } from '../common/baserow/programAdemeBaserow'
import { AdemeProgramBaserowToStaticConverter } from '../externalProgram/ademe/tmp_to_commit/ademeProgramBaserowToStaticConverter'

const main = async () => {
  const ademeApi = new TempAdemeApi()
  const baserowApi = new ProgramAdemeBaserow()
  const outConverter = new AdemeProgramBaserowToStaticConverter()
  const geographicAreas = await baserowApi.getGeographicAreas()
  const inConverter = new AdemeToDataProgramConverter(geographicAreas)

  const ademeDataManager = new AdemeDataManager(ademeApi, inConverter, baserowApi, outConverter)
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
