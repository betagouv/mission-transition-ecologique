import { OpportunityType } from '@tee/common'
import { ProgramType, Project } from '@tee/data'
import { CustomProject, OpportunityObjectDetails } from './types'

export class OpportunityAssociatedData {
  constructor(
    private _opportunityType: OpportunityType,
    public data: OpportunityObjectDetails
  ) {}

  public isProgram(): this is { data: ProgramType } {
    return this._opportunityType === OpportunityType.Program && this._isDefined() && !this._hasTitre()
  }

  public isProject(): this is { data: Project } {
    return this._opportunityType === OpportunityType.Project && this._isDefined() && this._hasSlug()
  }

  public isCustomProject(): this is { data: CustomProject } {
    return this._opportunityType === OpportunityType.CustomProject
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
