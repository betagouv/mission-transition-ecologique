import { OpportunityType, ThemeId } from '@tee/common'
import { ProgramType, ProjectType } from '@tee/data'
import { CustomProject, OpportunityObjectDetails } from './types'

export class OpportunityAssociatedData {
  constructor(
    private _opportunityType: OpportunityType,
    public data: OpportunityObjectDetails
  ) {}

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
      if (this.data.eligibilityData.questionnaire?.priorityObjectives?.length === 1) {
        return this.data.eligibilityData.questionnaire.priorityObjectives[0]
      }
    }

    if (this.isProject()) {
      return this.data.mainTheme
    }

    return undefined
  }

  private _hasSlug(): boolean {
    return this._isDefined() && 'slug' in this.data
  }

  private _hasTitre(): boolean {
    return this._isDefined() && 'titre' in this.data
  }

  private _isDefined(): boolean {
    return this.data !== undefined
  }
}
