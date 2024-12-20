import { ProgramService } from '@tee/backend-ddd'

export default defineNitroPlugin(() => {
  ProgramService.init()
})
