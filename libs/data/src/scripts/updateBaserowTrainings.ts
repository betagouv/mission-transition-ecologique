import { TrainingFeatures } from '../trainings/trainingFeatures'

console.log('Start the Training updates')

new TrainingFeatures()
  .loadTrainings()
  .then(() => {
    console.log('Project data generated')
  })
  .catch((error) => {
    console.error('Error during the project data generation:', error)
  })
