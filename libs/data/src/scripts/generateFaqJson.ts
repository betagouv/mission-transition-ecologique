import Config from '../config'
import { FaqFeature } from '../faq/faqFeature'

Config.loadDotEnv()

console.log(`=== Start loading Baserow data and creating the FAQ JSON ===`)
await new FaqFeature()
  .generateFaqJson()
  .then(() => {
    console.log('=== FAQ data generated ===')
  })
  .catch((error) => {
    console.error('Error during the FAQ data generation:', error)
  })
