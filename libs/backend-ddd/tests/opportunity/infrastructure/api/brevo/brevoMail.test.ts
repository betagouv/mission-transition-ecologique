import { SendSmtpEmail } from '@getbrevo/brevo'
import { OpportunityType } from '@tee/common'
import { ProgramType, ProjectType } from '@tee/data'
import BrevoMail from '../../../../../src/opportunity/infrastructure/api/brevo/brevoMail'
import { OpportunityAssociatedData } from '../../../../../src/opportunity/domain/opportunityAssociatedData'
import { fakeOpportunity } from '../../../opportunity.fixtures'

const sentEmail = async (associatedData: OpportunityAssociatedData): Promise<SendSmtpEmail> => {
  vi.stubEnv('BREVO_API_TOKEN', 'fake-token')
  vi.stubEnv('BREVO_SENDER_ID', '1')
  const brevoMail = new BrevoMail()
  const sendTransacEmail = vi.fn().mockResolvedValue({})
  ;(brevoMail as unknown as { _api: { sendTransacEmail: typeof sendTransacEmail } })._api.sendTransacEmail = sendTransacEmail

  await brevoMail.sendReturnReceipt(
    { ...fakeOpportunity(), message: 'https://phishing.example', firstName: 'Support', lastName: 'Officiel' },
    associatedData
  )

  return sendTransacEmail.mock.calls[0][0] as SendSmtpEmail
}

const fakeProgram = {
  titre: 'Accélérateur décarbonation',
  promesse: 'Réduire vos émissions',
  'opérateur de contact': 'Bpifrance'
} as unknown as ProgramType

describe('BrevoMail return receipt', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('does not echo the title typed by the user for a custom project', async () => {
    const email = await sentEmail(
      new OpportunityAssociatedData(OpportunityType.CustomProject, { title: 'Régularisez votre dossier, appelez le 08 99 00 00 00' })
    )

    expect(email.params?.['projectName']).toBe(BrevoMail.customProjectName)
  })

  test('uses the catalog title for a project', async () => {
    const email = await sentEmail(new OpportunityAssociatedData(OpportunityType.Project, { title: 'Rénover mon bâtiment' } as ProjectType))

    expect(email.params?.['projectName']).toBe('Rénover mon bâtiment')
  })

  test.each([
    [OpportunityType.Program, fakeProgram, ['programName', 'prefixedProgramName', 'programPromise', 'operatorName', 'date']],
    [OpportunityType.Project, { title: 'Rénover mon bâtiment' } as ProjectType, ['projectName', 'date']],
    [OpportunityType.CustomProject, { title: 'Mon projet' }, ['projectName', 'date']]
  ])('only sends our own data to the %s template', async (type, data, expectedKeys) => {
    const email = await sentEmail(new OpportunityAssociatedData(type, data))

    expect(Object.keys(email.params ?? {}).sort()).toEqual([...expectedKeys].sort())
    expect(JSON.stringify(email.params)).not.toContain('phishing')
  })

  test('does not set the recipient name', async () => {
    const email = await sentEmail(new OpportunityAssociatedData(OpportunityType.Project, { title: 'Rénover mon bâtiment' } as ProjectType))

    expect(email.to).toEqual([{ email: fakeOpportunity().email }])
  })
})
