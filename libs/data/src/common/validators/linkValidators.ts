import axios from 'axios'

export class LinkValidator {
  // those link http response is 4XX but this is expected.
  private static _exceptionLinks = [
    'https://www.baisseleswatts.fr/?mtm_campaign=missiontransitionecologique&mtm_source=missiontransitionecologique&mtm_medium=missiontransitionecologique&mtm_content=missiontransitionecologique',
    'https://www.cci.fr/ressources/developpement-durable/cfde/nos-formations',
    'https://www.impots.gouv.fr/sites/default/files/formulaires/2079-bio-sd/2024/2079-bio-sd_4636.pdf'
  ]

  public static async isValidLink(link: string) {
    if (this._exceptionLinks.includes(link)) {
      return true
    }
    try {
      const response = await axios.head(link, { timeout: 2000 })
      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      // Add a 100ms delay to avoid being detected as spam
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}
