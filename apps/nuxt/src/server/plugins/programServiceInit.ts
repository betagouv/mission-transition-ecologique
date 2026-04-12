import { initData } from '@tee/data/static'
import { ProgramService } from '@tee/backend-ddd'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  initData(Boolean(config.isTestData))
  ProgramService.init()
})
