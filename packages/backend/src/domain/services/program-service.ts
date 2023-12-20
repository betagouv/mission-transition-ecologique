import { currentDateService } from '../../infrastructure/current-date'
import { createService as createFilterService } from '../program/filter-programs'

export { sortPrograms } from '../program/sort-programs'

export const filterPrograms = createFilterService(currentDateService)
