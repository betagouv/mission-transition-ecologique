import { FaqBaserow } from '../common/baserow/faq/faqBaserow'
import { Logger } from '../common/logger/logger'
import { LoggerType } from '../common/logger/types'
import Config from '../config/config'
import { FaqFeature } from '../faq/faqFeature'
import { FaqFilter } from '../faq/faqFilter'

Config.loadDotEnv()

console.log(`=== Start loading Baserow data and creating the FAQ JSON ===`)
const logger = new Logger(LoggerType.Faq)
await new FaqFeature(new FaqBaserow(logger), new FaqFilter(logger), logger)
  .generateFaqJson()
  .then(() => {
    console.log('=== FAQ data generated ===')
  })
  .catch((error) => {
    console.error('Error during the FAQ data generation:', error)
  })
