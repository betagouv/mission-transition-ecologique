import { CoverageGenerator } from '../coverage/coverageGenerator'

console.log('Start coverage data generation')

try {
  new CoverageGenerator().generate()
} catch (error) {
  console.error('Error during coverage data generation:', error)
  process.exit(1)
}
