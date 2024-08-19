import fs from 'fs'

const mainResults = JSON.parse(fs.readFileSync('results_main.json', 'utf8'))
const featureResults = JSON.parse(fs.readFileSync('results_feature.json', 'utf8'))

if (JSON.stringify(mainResults) === JSON.stringify(featureResults)) {
  console.log('Results match between main and feature branch.')
} else {
  console.log('Results do not match between main and feature branch.')
  console.log('Main branch results:', mainResults)
  console.log('Feature branch results:', featureResults)
}
