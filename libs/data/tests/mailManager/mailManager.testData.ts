import { DataProgram } from '../../src/program/types/domain'

export interface MailManagerTestCase {
  name: string
  testData: Partial<Pick<DataProgram, 'tech' | 'Statuts' | 'DISPOSITIF_DATE_DEBUT' | 'DISPOSITIF_DATE_FIN'>>
  expected: {
    sendInitialMail: boolean
    sendPeriodicMail: boolean
    sendEolMail: boolean
  }
}

export const mailManagerTestCases: MailManagerTestCase[] = [
  {
    name: 'initial mail should be sent if no last_mail_sent_date',
    testData: {
      tech: JSON.stringify({ email_enable: true }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2024-12-31',
      Statuts: []
    },
    expected: {
      sendInitialMail: true,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  },
  {
    name: 'no mail if email_enable is false',
    testData: {
      tech: JSON.stringify({ email_enable: false }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2024-12-31',
      Statuts: []
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  }
]
