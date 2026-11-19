import { OpportunityType, ThemeId } from '@tee/common'
import { ProgramType, ProjectType } from '@tee/data'
import { CustomProject, OpportunityObjectDetails } from './types'

export class OpportunityAssociatedData {
  constructor(
    private _opportunityType: OpportunityType,
    public data: OpportunityObjectDetails,
    // Name of the partner whose API key authenticated the request (e.g. agir), undefined for the TEE site.
    // Set by the server only, never read from the request body.
    public readonly partner?: string
  ) {}

  // Sentry tags of the whole opportunity workflow, to filter the errors of a partner (never the API key)
  public monitorTags(): { [key: string]: string } {
    return this.partner ? { partner: this.partner } : {}
  }

  public isProgram(): this is { data: ProgramType } {
    return this._opportunityType === OpportunityType.Program
  }

  public isProject(): this is { data: ProjectType } {
    return this._opportunityType === OpportunityType.Project
  }

  public isCustomProject(): this is { data: CustomProject } {
    return this._opportunityType === OpportunityType.CustomProject
  }

  public getThemeId(): ThemeId | undefined {
    if (this.isProgram()) {
      if (this.data.eligibilityData.priorityObjectives?.length === 1) {
        return this.data.eligibilityData.priorityObjectives[0]
      }
    }

    if (this.isProject()) {
      return this.data.mainTheme
    }

    return undefined
  }
}
