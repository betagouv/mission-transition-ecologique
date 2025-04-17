import RedirectFeatures from '../domain/redirectFeatures'
import { RedirectRepository } from '../infrastructure/redirects'

export class RedirectService {
  private _redirect: RedirectFeatures

  public constructor() {
    this._redirect = new RedirectFeatures(new RedirectRepository())
  }

  public getByProgramSlug(slug: string): string | undefined {
    return this._redirect.getByProgramSlug(slug)
  }

  public getByProjectSlug(slug: string): string | undefined {
    return this._redirect.getByProjectSlug(slug)
  }
}
