import { describe, expect, it, vi } from 'vitest'
import { CompanyDataStorage } from './companyDataStorage'
import { CompanyDataValidator } from './validator/validator'
import { CompanyDataRegisterType } from '@/utils/companyData/types/companyDataType'

describe('CompanyDataStorage - isDataFull', () => {
  it('should return false if company data is missing', () => {
    vi.spyOn(CompanyDataStorage, 'getCompanyData').mockReturnValueOnce(null)
    const result = CompanyDataStorage.isDataFull().value
    expect(result).toBe(false)
  })

  it('should return false if CompanyDataValidator.validate returns false for empty data', () => {
    const result = CompanyDataValidator.validate({} as CompanyDataRegisterType)
    expect(result).toBe(false)
  })

  it('should return false if CompanyDataValidator.validate returns false for partial ManualCompanyData', () => {
    const validCompanyData = {
      region: 'Bretagne',
      denomination: 'Entreprise : industrie - Bretagne',
      structure_size: 'ME'
    }
    const result = CompanyDataValidator.validate(validCompanyData as CompanyDataRegisterType)
    expect(result).toBe(false)
  })

  it('should return true if CompanyDataValidator.validate returns true for ManualCompanyData', () => {
    const validCompanyData = {
      region: 'Bretagne',
      secteur: 'industrie',
      denomination: 'Entreprise : industrie - Bretagne',
      structure_size: 'ME'
    }
    const result = CompanyDataValidator.validate(validCompanyData as CompanyDataRegisterType)
    expect(result).toBe(true)
  })

  it('should return false if CompanyDataValidator.validate returns false for partial EstablishmentFront', () => {
    const validCompanyData = {
      siret: '84026120000017',
      codeNAF: '49.41B',
      codeNAF1: 'H',
      ville: 'ARGENTEUIL',
      codePostal: '95100',
      region: 'Île-de-France',
      legalCategory: '5710',
      creationDate: '2018-04-20',
      structure_size: 'TPE'
    }
    const result = CompanyDataValidator.validate(validCompanyData as CompanyDataRegisterType)
    expect(result).toBe(false)
  })

  it('should return true if CompanyDataValidator.validate returns true for EstablishmentFront', () => {
    const validCompanyData = {
      siret: '84026120000017',
      codeNAF: '49.41B',
      codeNAF1: 'H',
      ville: 'ARGENTEUIL',
      codePostal: '95100',
      region: 'Île-de-France',
      legalCategory: '5710',
      denomination: 'REZ',
      secteur: 'Transports routiers de fret de proximité',
      creationDate: '2018-04-20',
      structure_size: 'TPE'
    }
    const result = CompanyDataValidator.validate(validCompanyData as CompanyDataRegisterType)
    expect(result).toBe(true)
  })
})
