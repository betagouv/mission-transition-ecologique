import { Result } from 'true-myth'
import { addBrevoContact } from '../../../../../src/opportunity/infrastructure/api/brevo/brevoContact'
import BrevoAPI from '../../../../../src/opportunity/infrastructure/api/brevo/brevoAPI'
import Monitor from '../../../../../src/common/domain/monitoring/monitor'
import { fakeContact } from '../../../opportunity.fixtures'
import { expectToBeErr } from '../../../../testing'

describe('addBrevoContact errors', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_TOKEN', 'fake-token')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  test('reports a CreateContact error with the partner tags', async () => {
    const monitorError = vi.spyOn(Monitor, 'error').mockReturnValue(Monitor)
    vi.spyOn(BrevoAPI.prototype, 'PostContact').mockResolvedValue(Result.err(new Error('brevo down')))

    expectToBeErr(await addBrevoContact(fakeContact(), true, { partner: 'agir' }))

    expect(monitorError).toHaveBeenCalledWith('Error in Brevo CreateContact api call', expect.anything(), { partner: 'agir' })
  })

  test('reports a GetContact error with the partner tags', async () => {
    const monitorError = vi.spyOn(Monitor, 'error').mockReturnValue(Monitor)
    vi.spyOn(BrevoAPI.prototype, 'PostContact').mockResolvedValue(Result.ok({ status: 204, data: '' } as never))
    vi.spyOn(BrevoAPI.prototype, 'GetContact').mockResolvedValue(Result.err(new Error('brevo down')))

    expectToBeErr(await addBrevoContact(fakeContact(), true, { partner: 'agir' }))

    expect(monitorError).toHaveBeenCalledWith('Error in Brevo GetContact api call', expect.anything(), { partner: 'agir' })
  })
})
