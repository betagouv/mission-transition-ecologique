import Redirect from '../common/redirect/redirect'

console.log('Start the Redirections generation')

new Redirect()
  .generateRedirectJson()
  .then(() => {
    console.log('Redirections generated')
  })
  .catch((error) => {
    console.error('Error during the Redirections Json generation:', error)
  })
