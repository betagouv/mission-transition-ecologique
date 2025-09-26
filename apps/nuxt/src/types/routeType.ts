export enum RouteName {
  Homepage = 'homepage',
  Budget = 'budget',
  CatalogPrograms = 'catalogPrograms',
  CatalogProjects = 'catalogProjects',
  CatalogProgramDetail = 'catalog-program-detail',
  CatalogProjectDetail = 'catalog-project-detail',
  CatalogProgramFromCatalogProjectDetail = 'catalog-program-from-project-detail',
  AddProgram = 'add-program',
  Legal = 'legal',
  PersonalData = 'personal-data',
  QuestionnaireStart = 'questionnaire-start',
  Questionnaire = 'questionnaire',
  QuestionnaireResult = 'questionnaire-resultat',
  ProgramResultDetail = 'program-result-detail',
  ProgramFromProjectResultDetail = 'program-from-project-detail',
  ProjectResultDetail = 'project-result-detail',
  Statistics = 'statistics',
  Accessibility = 'accessibility',
  Faq = 'faq'
}

export enum RoutePath {
  CatalogProgramDetail = '/aides-entreprise/:programId',
  CatalogProjectDetail = '/projets-entreprise/:projectSlug'
}
