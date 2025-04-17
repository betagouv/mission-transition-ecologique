import { redirects } from '@tee/data/static'
import { RedirectRepositoryType } from '../domain/spi'

export class RedirectRepository implements RedirectRepositoryType {
  public getByProgramSlug(slug: string): string | undefined {
    const redirect = redirects.program_redirects[slug]
    return redirect ? redirect : undefined
  }

  public getByProjectSlug(slug: string): string | undefined {
    const redirect = redirects.project_redirects[slug]
    return redirect ? redirect : undefined
  }
}
