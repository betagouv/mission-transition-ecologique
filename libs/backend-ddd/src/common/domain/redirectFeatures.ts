import { RedirectRepository } from '../infrastructure/redirects'

export default class RedirectFeatures {
  private _redirectRepository: RedirectRepository

  constructor(redirectRepository: RedirectRepository) {
    this._redirectRepository = redirectRepository
  }

  public getByProgramSlug(slug: string): string | undefined {
    return this._redirectRepository.getByProgramSlug(slug)
  }

  public getByProjectSlug(slug: string): string | undefined {
    return this._redirectRepository.getByProjectSlug(slug)
  }
}
