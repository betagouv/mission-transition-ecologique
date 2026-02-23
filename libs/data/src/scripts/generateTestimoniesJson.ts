import { TestimonyFeatures } from '../testimony/testimonyFeatures'

console.log('Start the Testimonies generation')

new TestimonyFeatures().updateTestimonyData().catch((error) => {
  console.error('Error during the Testimonies Json generation:', error)
})
