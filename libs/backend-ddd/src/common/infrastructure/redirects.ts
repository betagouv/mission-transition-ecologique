import { redirects } from '@tee/data/static'
import { RedirectRepositoryType } from '../domain/spi'

export class RedirectRepository implements RedirectRepositoryType {
  public getProgramRedirect(slug: string): string | undefined {
    const redirect = redirects.program_redirects[slug]
    return redirect ? redirect : undefined
  }

  public getProjectRedirect(slug: string): string | undefined {
    const redirect = redirects.project_redirects[slug]
    return redirect ? redirect : undefined
  }
}
