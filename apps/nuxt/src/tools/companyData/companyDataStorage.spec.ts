import { describe, expect, it } from 'vitest'
import { CompanyDataValidator } from './companyDataSchemaValidator'
import { CompanyDataRegisterType } from '@/tools/companyData/types/companyDataType'
import { CompanyData } from '@/tools/companyData/companyData'

describe('CompanyDataStorage - isDataFull', () => {
  it('should return false if company data is missing', () => {
    const result = CompanyData.isDataFullComputed().value
    expect(result).toBe(false)
  })

  it('should return false if CompanyDataValidator.validate returns false for empty data', () => {
    const result = CompanyDataValidator.validate({} as CompanyDataRegisterType)
    expect(result).toBe(false)
  })

  it('should return false if CompanyDataValidator.validate returns false for partial ManualCompanyData', () => {
    const validCompanyData = {
      region: 'Bretagne',
      ville: 'Brest',
      codePostal: '29200',
      denomination: 'Entreprise : industrie - Bretagne',
      structure_size: 'ME'
    }
    const result = CompanyDataValidator.validate(validCompanyData as CompanyDataRegisterType)
    expect(result).toBe(false)
  })

  it('should return true if CompanyDataValidator.validate returns false for ManualCompanyData with undefined param', () => {
    const validCompanyData = {
      region: undefined,
      ville: undefined,
      codePostal: undefined,
      secteur: 'Aide par le travail',
      codeNAF: '88.10C',
      codeNAF1: 'Q',
      denomination: 'Entreprise : Aide par le travail - Bretagne',
      structure_size: 'ME'
    }
    const result = CompanyDataValidator.validate(validCompanyData as CompanyDataRegisterType)
    expect(result).toBe(false)
  })

  it('should return true if CompanyDataValidator.validate returns true for ManualCompanyData', () => {
    const validCompanyData = {
      region: 'Bretagne',
      ville: 'Brest',
      codePostal: '29200',
      secteur: 'Aide par le travail',
      codeNAF: '88.10C',
      codeNAF1: 'Q',
      denomination: 'Entreprise : Aide par le travail - Bretagne',
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
