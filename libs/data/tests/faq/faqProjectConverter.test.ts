import { describe, test, expect, beforeEach, vi } from 'vitest'
import { LoggerInterface, LoggerType, LogLevel } from '../../src/common/logger/types'
import { FaqProjectConverter } from '../../src/common/baserow/faq/faqConverter/faqProjectConverter'
import { LoggerMock } from '../logger.mock'
import * as faqFixtures from './fixtures/faq.fixtures'
import { faqsWithProjects } from './fixtures/faq.fixtures'
import { dataProjectFixtures } from './fixtures/project.fixtures'
import { BaserowFaq } from '../../src/common/baserow/types'

describe('FaqProjectConverter', () => {
  let faqProjectConverter: FaqProjectConverter
  let mockLogger: LoggerInterface

  const getProjectFaqs = () => {
    return faqFixtures.faqsWithProjects as unknown as BaserowFaq[]
  }

  beforeEach(() => {
    mockLogger = new LoggerMock()
    vi.spyOn(mockLogger, 'log')
    faqProjectConverter = new FaqProjectConverter(mockLogger)
  })

  describe('toDomain', () => {
    test('should convert fixture data to domain format correctly', async () => {
      const result = faqProjectConverter.toDomain(getProjectFaqs(), dataProjectFixtures)

      // Should have project-based structure
      expect(Object.keys(result).length).toBeGreaterThan(0)

      // Check that project 1 has FAQs
      expect(result[1]).toBeDefined()
      expect(Array.isArray(result['1'])).toBe(true)
      expect(result[1].length).toBeGreaterThan(0)

      // Check that project 2 has FAQs
      expect(result[2]).toBeDefined()
      expect(Array.isArray(result['2'])).toBe(true)
      expect(result[2].length).toBeGreaterThan(0)

      // Check FAQ structure
      for (const projectId in result) {
        const questions = result[projectId]
        questions.forEach((question) => {
          expect(question).toHaveProperty('id')
          expect(question).toHaveProperty('question')
          expect(question).toHaveProperty('answer')
          expect(typeof question.id).toBe('number')
          expect(typeof question.question).toBe('string')
        })
      }
    })

    test('should handle empty input arrays', () => {
      const result = faqProjectConverter.toDomain([], [])
      expect(result).toEqual({})
    })

    test('should handle empty FAQ array with projects', () => {
      const result = faqProjectConverter.toDomain([], dataProjectFixtures)
      expect(result).toEqual({})
    })

    test('should handle empty projects array with FAQs', () => {
      const result = faqProjectConverter.toDomain(faqsWithProjects, [])
      expect(result).toEqual({})
    })

    test('should properly sort questions by order', () => {
      const result = faqProjectConverter.toDomain(getProjectFaqs(), dataProjectFixtures)
      // Check that questions are sorted by order
      for (const key in result) {
        const projectFaqs = result[key]
        let lastQuestionNumber = '0'
        for (const projectFaq of projectFaqs) {
          // 'question 3' get the number 3
          const questionNumber = projectFaq.question.match(/Project FAQ question (\d+)/i)
          if (questionNumber && questionNumber[0]) {
            lastQuestionNumber = questionNumber[0]
          } else if (questionNumber) {
            expect(Number(questionNumber[0])).greaterThan(Number(lastQuestionNumber))
          }
        }
      }
    })

    test('should filter out FAQs with both Page and Projet links', () => {
      const result = faqProjectConverter.toDomain(getProjectFaqs(), dataProjectFixtures)

      // Should log the mixed link and not include in results
      expect(mockLogger.log).toHaveBeenCalledWith(
        LogLevel.Critic,
        expect.stringContaining('FAQ lié à une page statique: Accueil et à un projet'),
        expect.stringContaining('FAQ ID Baserow: 1004'),
        1004,
        1004,
        LoggerType.Faq
      )

      // Ensure FAQ with both links is not in results
      for (const projectId in result) {
        const faqs = result[projectId]
        faqs.forEach((faq) => {
          expect(faq.id).not.toBe(1004)
        })
      }
    })

    test('should filter out FAQs with no Page and no Projet links', () => {
      const result = faqProjectConverter.toDomain(getProjectFaqs(), dataProjectFixtures)

      // Should log the unlinked FAQ and not include in results
      expect(mockLogger.log).toHaveBeenCalledWith(
        LogLevel.Critic,
        'FAQ non lié à une page statique ni à un projet',
        'FAQ ID Baserow: 1008',
        1008,
        1008,
        LoggerType.Faq
      )

      for (const projectId in result) {
        const faqs = result[projectId]
        faqs.forEach((faq) => {
          expect(faq.id).not.toBe(1008)
        })
      }
    })

    test('should filter out FAQs linked to non-existent projects', () => {
      const result = faqProjectConverter.toDomain(getProjectFaqs(), dataProjectFixtures)

      // Should log the unlinked FAQ and not include in results
      // Should log the unlinked FAQ (since project doesn't exist, it's treated as unlinked)
      expect(mockLogger.log).toHaveBeenCalledWith(
        LogLevel.Critic,
        'FAQ non lié à une page statique ni à un projet',
        'FAQ ID Baserow: 1007',
        1007,
        1007,
        LoggerType.Faq
      )

      for (const projectId in result) {
        const faqs = result[projectId]
        faqs.forEach((faq) => {
          expect(faq.id).not.toBe(1007)
        })
      }
    })

    test('should group FAQs by project ID correctly', () => {
      const result = faqProjectConverter.toDomain(getProjectFaqs(), dataProjectFixtures)

      // Should have separate groups for different projects
      expect(result[1]).toBeDefined()
      expect(result[2]).toBeDefined()

      // Project 1 should have 2 FAQs (excluding mixed and inactive ones)
      expect(result[1].length).toBe(2)

      // Project 2 should have 1 FAQ
      expect(result[2].length).toBe(1)

      // Check that FAQs are properly mapped to correct projects
      expect(result[1][0].question).toBe('Project FAQ question 1')
      expect(result[1][1].question).toBe('Project FAQ question 2')
      expect(result[2][0].question).toBe('Project FAQ question 3')
    })

    test('should handle FAQs with empty question', () => {
      const emptyQuestionFaq: BaserowFaq = {
        id: 5001,
        Question: '',
        Réponse: 'Answer without question',
        Actif: true,
        Page: null,
        Section: [{ id: 1, value: 'Test', order: '1.0' }],
        order: 1,
        Projet: [{ id: 1, value: 'Test Project 1' }]
      }

      const result = faqProjectConverter.toDomain([emptyQuestionFaq], dataProjectFixtures)

      expect(result['1']).toBeDefined()
      expect(result['1'].length).toBe(1)
      expect(result['1'][0].question).toBe('')
      expect(result['1'][0].answer).toBe('Answer without question')
    })

    test('should handle FAQs with empty answer', () => {
      const nullAnswerFaq: BaserowFaq = {
        id: 5002,
        Question: 'Question without answer',
        Réponse: '',
        Actif: true,
        Page: null,
        Section: [{ id: 1, value: 'Test', order: '1.0' }],
        order: 1,
        Projet: [{ id: 1, value: 'Test Project 1' }]
      }

      const result = faqProjectConverter.toDomain([nullAnswerFaq], dataProjectFixtures)

      expect(result['1']).toBeDefined()
      expect(result['1'].length).toBe(1)
      expect(result['1'][0].question).toBe('Question without answer')
      expect(result['1'][0].answer).toBe('')
    })
  })
})
