import axios from 'axios'

import golden_file_1 from '../data/test_files/golden_file-siret-01.json'
import golden_file_2 from '../data/test_files/golden_file-siret-02.json'
import golden_file_3 from '../data/test_files/golden_file-siret-03.json'
import golden_file_4 from '../data/test_files/golden_file-siret-04.json'

describe('Test that API response format is unchanged', () => {
  const test_siret = ['83014132100034', '13002526500013', '80053452100011', '88003990400011']
  const expected_data = [golden_file_1, golden_file_2, golden_file_3, golden_file_4]

  test_siret.map((siret, index) => {
    test(`Compare response data with golden file for siret ${siret}`, async () => {
      // const api_host = 'https://tee-backend-test.osc-fr1.scalingo.io'
      const api_host = 'http://localhost:3000' // local API Express - should be started before testing
      const api_path = '/api/insee/get_by_siret'
      const api_url = `${api_host}${api_path}`

      const request_body = { siret: siret }
      const postData = JSON.stringify(request_body)

      const headers = {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }

      const response = await axios(api_url, {
        method: 'post',
        headers: headers,
        data: postData
      })
      const respData = response.data

      expect(respData).toEqual(expected_data[index])
    })
  })
})
