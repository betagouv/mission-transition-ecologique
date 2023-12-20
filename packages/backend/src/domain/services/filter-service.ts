import { currentDateService } from '../../infrastructure/current-date'
import { createService as createFilterService } from '../filter-programs'

export const filterPrograms = createFilterService(currentDateService)
