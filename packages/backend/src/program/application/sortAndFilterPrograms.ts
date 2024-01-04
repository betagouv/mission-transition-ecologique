import { currentDateService } from '../infrastructure/currentDate'
import { createService as createFilterService } from '../domain/filterPrograms'

export { sortPrograms } from '../domain/sortPrograms'

export const filterPrograms = createFilterService(currentDateService)
