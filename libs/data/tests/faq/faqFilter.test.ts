import { describe, test, expect, beforeEach, vi } from 'vitest'
import { FaqFilter } from '../../src/faq/faqFilter'
import { LoggerMock } from '../logger.mock'
import { LogLevel } from '../../src/common/logger/types'
import { FaqPage } from '../../src/faq/types/shared'
import { Color } from '@tee/common'
import * as faqFixtures from './fixtures/faq.fixtures'
import { FaqBaserowMock } from './faqBaserow.mock'

// Mock the LinkValidator module
vi.mock('../../src/common/validators/linkValidator', () => ({
  LinkValidator: {
    logInvalidLinks: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('FaqFilter', () => {
  let faqFilter: FaqFilter
  let mockLogger: LoggerMock

  beforeEach(() => {
    mockLogger = new LoggerMock()
    vi.spyOn(mockLogger, 'log')
    faqFilter = new FaqFilter(mockLogger)
  })

  describe('byActive', () => {
    test('should filter only active FAQs using fixture data', async () => {
      const { baserowFaqs } = await new FaqBaserowMock().getFaqs()
      const activeFaqs = baserowFaqs.filter((faq) => faq.Actif)
      const inactiveFaqs = baserowFaqs.filter((faq) => !faq.Actif)

      const result = faqFilter.byActive(baserowFaqs)

      expect(result).toHaveLength(activeFaqs.length)
      expect(result.every((faq) => faq.Actif)).toBe(true)

      // Ensure inactive FAQs are not in the result
      inactiveFaqs.forEach((inactiveFaq) => {
        expect(result.find((faq) => faq.id === inactiveFaq.id)).toBeUndefined()
      })
    })

    test('should return empty array when no active FAQs', () => {
      const result = faqFilter.byActive(faqFixtures.inactiveFaqs)
      expect(result).toHaveLength(0)
    })

    test('should handle empty input array', () => {
      const result = faqFilter.byActive([])
      expect(result).toHaveLength(0)
    })
  })

  describe('byValidity', () => {
    test('should validate FAQs and remove invalid ones', async () => {
      const faqs = {
        [FaqPage.Home]: [
          {
            title: 'Test Section',
            color: Color.blue,
            questions: [
              {
                id: 1,
                question: 'Valid question',
                answer: 'Valid answer'
              },
              {
                id: 2,
                question: '', // Invalid - no question
                answer: 'Some answer'
              },
              {
                id: 3,
                question: 'Another question',
                answer: '' // Invalid - no answer
              }
            ]
          }
        ]
      }

      await faqFilter.byValidity(faqs)

      // Should remove invalid FAQs, leaving only the valid one
      expect(faqs[FaqPage.Home][0].questions).toHaveLength(1)
      expect(faqs[FaqPage.Home][0].questions[0].id).toBe(1)

      // Should log errors for invalid FAQs
      expect(mockLogger.log).toHaveBeenCalledWith(LogLevel.Major, 'Question non fournie', 'Test Section', 2)
      expect(mockLogger.log).toHaveBeenCalledWith(LogLevel.Major, 'Réponse non fournie', 'Test Section', 3)
      expect(mockLogger.log).toHaveBeenCalledTimes(2)
    })

    test('should call LinkValidator for valid answers', async () => {
      const LinkValidator = await import('../../src/common/validators/linkValidator')

      const faqs = {
        [FaqPage.Home]: [
          {
            title: 'Test Section',
            color: Color.blue,
            questions: [
              {
                id: 1,
                question: 'Valid question',
                answer: 'Valid answer with links'
              }
            ]
          }
        ]
      }

      await faqFilter.byValidity(faqs)

      expect(LinkValidator.LinkValidator.logInvalidLinks).toHaveBeenCalledWith(
        'Valid answer with links',
        mockLogger,
        LogLevel.Major,
        'Réponse',
        'Valid answer with links',
        1
      )
    })

    test('should handle empty FAQ structure', async () => {
      const faqs = {}

      await faqFilter.byValidity(faqs)

      expect(mockLogger.log).not.toHaveBeenCalled()
    })

    test('should handle multiple pages correctly', async () => {
      const faqs = {
        [FaqPage.Home]: [
          {
            title: 'Home Section',
            color: Color.blue,
            questions: [
              {
                id: 1,
                question: 'Valid home question',
                answer: 'Valid home answer'
              }
            ]
          }
        ],
        [FaqPage.Faq]: [
          {
            title: 'FAQ Section',
            color: Color.red,
            questions: [
              {
                id: 2,
                question: 'Valid FAQ question',
                answer: 'Valid FAQ answer'
              }
            ]
          }
        ]
      }

      await faqFilter.byValidity(faqs)

      // Home section should keep its valid question
      expect(faqs[FaqPage.Home][0].questions).toHaveLength(1)
      expect(faqs[FaqPage.Home][0].questions[0].id).toBe(1)

      // FAQ section should keep its question (empty string is truthy)
      expect(faqs[FaqPage.Faq][0].questions).toHaveLength(1)
      expect(faqs[FaqPage.Faq][0].questions[0].id).toBe(2)
    })

    test('should prioritize question validation over answer validation', async () => {
      const faqs = {
        [FaqPage.Home]: [
          {
            title: 'Test Section',
            color: Color.blue,
            questions: [
              {
                id: 1,
                question: '', // Invalid question
                answer: '' // Also invalid answer, but question should be prioritized
              }
            ]
          }
        ]
      }

      await faqFilter.byValidity(faqs)

      // Since empty string is truthy, question validation will be checked
      expect(mockLogger.log).toHaveBeenCalledWith(LogLevel.Major, 'Question non fournie', 'Test Section', 1)

      // Should not call with answer error since question error is prioritized
      expect(mockLogger.log).not.toHaveBeenCalledWith(LogLevel.Major, 'Réponse non fournie', 'Test Section', 1)
    })

    test('should handle sections with no questions', async () => {
      const faqs = {
        [FaqPage.Home]: [
          {
            title: 'Empty Section',
            color: Color.blue,
            questions: []
          }
        ]
      }

      await faqFilter.byValidity(faqs)

      expect(mockLogger.log).not.toHaveBeenCalled()
      expect(faqs[FaqPage.Home][0].questions).toHaveLength(0)
    })
  })
})
