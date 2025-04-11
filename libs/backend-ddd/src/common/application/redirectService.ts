import RedirectFeatures from '../domain/redirectFeatures'
import { RedirectRepository } from '../infrastructure/redirects'

export class RedirectService {
  private _redirect: RedirectFeatures

  public constructor() {
    this._redirect = new RedirectFeatures(new RedirectRepository())
  }

  public getProgramRedirect(slug: string): string | undefined {
    return this._redirect.getProgramRedirect(slug)
  }

  public getProjectRedirect(slug: string): string | undefined {
    return this._redirect.getProjectRedirect(slug)
  }
}
