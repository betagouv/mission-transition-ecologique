import { FaqBaserow } from '../common/baserow/faq/faqBaserow'
import { Logger } from '../common/logger/logger'
import { LoggerType } from '../common/logger/types'
import { ProjectFeatures } from '../project/projectFeatures'

console.log('Start the project data generation')

const logger = new Logger(LoggerType.Project)
new ProjectFeatures(logger, new FaqBaserow(logger))
  .generateProjectsJson()
  .then(() => {
    console.log('Project data generated')
  })
  .catch((error) => {
    console.error('Error during the project data generation:', error)
  })
