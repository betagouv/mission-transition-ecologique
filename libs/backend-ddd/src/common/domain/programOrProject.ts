import { OpportunityType } from '@tee/common'
import { ProgramType, Project } from '@tee/data'
import { ProgramOrProjectType } from './types'

export class ProgramOrProject {
  constructor(
    private _opportunityType: OpportunityType,
    private _programOrProject: ProgramOrProjectType
  ) {}

  public getProgram(): ProgramType {
    if (this.isProgram(this._programOrProject)) {
      return this._programOrProject
    }

    throw new Error('Program not found')
  }

  public getProject(): Project {
    if (this.isProject(this._programOrProject)) {
      return this._programOrProject
    }
    throw new Error('Project not found')
  }

  public getCustomProject(): undefined {
    if (this.isCustomProject(this._programOrProject)) {
      return this._programOrProject
    }
    throw new Error('The type of opportunity is not Custom Project')
  }

  public getProjectOrCustom(): Project | undefined {
    if (this.isProject(this._programOrProject)) {
      return this._programOrProject
    }
    if (this.isCustomProject(this._programOrProject)) {
      return undefined
    }
    throw new Error('The type of opportunity is not Project or Custom Project')
  }

  public isProgram(programOrProject: ProgramOrProjectType): programOrProject is ProgramType {
    return this._opportunityType === OpportunityType.Program && this._isDefined(programOrProject) && !this._hasTitle(programOrProject)
  }

  public isProject(programOrProject: ProgramOrProjectType): programOrProject is Project {
    return this._opportunityType === OpportunityType.Project && this._hasTitle(programOrProject)
  }

  public isCustomProject(programOrProject: ProgramOrProjectType): programOrProject is undefined {
    return this._opportunityType === OpportunityType.CustomProject
  }

  private _hasTitle(programOrProject: ProgramOrProjectType): boolean {
    return this._isDefined(programOrProject) && 'title' in programOrProject
  }

  private _isDefined(programOrProject: ProgramOrProjectType): programOrProject is ProgramType | Project {
    return programOrProject !== undefined
  }
}
