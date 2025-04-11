import { RedirectRepository } from '../infrastructure/redirects'

export default class RedirectFeatures {
  private _redirectRepository: RedirectRepository

  constructor(redirectRepository: RedirectRepository) {
    this._redirectRepository = redirectRepository
  }

  public getProgramRedirect(slug: string): string | undefined {
    return this._redirectRepository.getProgramRedirect(slug)
  }

  public getProjectRedirect(slug: string): string | undefined {
    return this._redirectRepository.getProjectRedirect(slug)
  }
}
