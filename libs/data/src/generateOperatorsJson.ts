import { OperatorFeatures } from './operators/operatorFeatures'

console.log('Start the Operator generation')

new OperatorFeatures()
  .createOperatorsJson()
  .then(() => {
    console.log('OperatorJson generated')
  })
  .catch((error) => {
    console.error('Error during the Operator Json generation:', error)
  })
