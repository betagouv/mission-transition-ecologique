import { createService as createFilterService } from '../filter-programs'
import { CurrentDateService } from '../spi'

const currentDateService: CurrentDateService = {
  get: () => '2023-12-20'
}

export const filterPrograms = createFilterService(currentDateService)
