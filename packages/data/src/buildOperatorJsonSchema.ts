import { OperatorYamlGenerator } from './operators/operators'

console.log('Generating the operator Json Schema')

new OperatorYamlGenerator()
  .createOperatorsJsonSchema()
  .then(() => {
    console.log('Operator Json Schema generated')
  })
  .catch((error) => {
    console.error('Error during the generation:', error)
  })
