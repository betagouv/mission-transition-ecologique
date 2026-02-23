export interface AdemeReferentielItem {
  '@id': string
  '@type': string
  code: string
  dateDebut: string
  dateFin: string | null
  dateDerniereModification: string | null
  id: string
  libelle?: string
}

export interface AdemeDispositif {
  '@id': string
  '@type': string
  id: string
  typeAide: string
  idFonctionnel: string
  versions: any[]
  documentsInternes: any[]
  urlsInternes: any[]
}

export interface AdemeAppelAProjet {
  '@id': string
  '@type': string
  id: string
  acronyme: string
  sequenceAcronyme: number
  courrielContactAap: string
  sousType: any
  typeMultiPhase: string
  releves: any[]
  dateResultats: string
  documentResultats: any | null
  programme: any
  appelConjoint: boolean
  leader: boolean
  motifModificationDateCloture: string | null
  aapPredepot: any | null
  aapDepot: any | null
}

export interface AdemeCouvertureGeo {
  '@id': string
  '@type': string
  code: string
  dateDebut: string
  dateFin: string | null
  dateDerniereModification: string | null
  id: string
}

export interface AdemeUniteDeGestion {
  '@id': string
  '@type': string
  code: string
  libelle: string
  dateDebut: string
  dateFin: string | null
  dateDerniereModification: string
  id: string
}

export interface AdemeDonneesPrevisionnelles {
  '@type': string
  '@id': string
  budget: number
  volumeDossiersEngages: number
  dateDebutEngagementDossiers: string
  dateFinEngagementDossiers: string
}

export interface AdemeEligibilite {
  '@id': string
  '@type': string
  id: string
  texteEligibilite: string | null
  documents: any[]
}

export interface AdemeCaracterisation {
  '@type': string
  '@id': string
  confidentialite: boolean
  modeGestionComptable: any | null
  sousProgrammeBudgetaire: any | null
  origineFonds: any | null
  natureLisa: any
  texteRapportFinal: string | null
}

export interface AdemeVoletFinancier {
  '@type': string
  '@id': string
  assistantFinancier: boolean
  urlAssistantFinancier: string | null
  urlDesacAssistantFinancier: string | null
  donneesAssistantFinancier: any[]
}

export interface AdemeProgramDetail {
  '@context': string
  '@id': string
  '@type': string
  id: string
  version: number
  dateDebut: string
  dateFin: string
  dateDerniereModification: string
  dateCreation: string | null
  dateDemandeCorrection: string | null
  dateSoumission: string
  auteur: string | null
  utilisateurDerniereModification: string
  dispositif: AdemeDispositif
  titre: string
  descriptionCourte: string
  description: string
  greAGre: any | null
  appelAProjet: AdemeAppelAProjet
  typeProjet: any[]
  typeDepot: string
  urlSitePartenaire: string | null
  urlBoutonMonAvis: string | null
  thematique: any[]
  cibleProjet: any[]
  naf: any[]
  multiActivites: boolean
  detailsCible: string
  zoneGeo: any[]
  couvertureGeo: AdemeCouvertureGeo
  referents: any[]
  responsableValidationNom: string
  responsableValidationPrenom: string
  responsableValidationEmail: string
  responsableValidationUniteDeGestion: AdemeUniteDeGestion
  coordinateurNom: string | null
  coordinateurPrenom: string | null
  coordinateurEmail: string | null
  coordinateurUniteDeGestion: any | null
  financements: any[]
  fonds: any[]
  forfaitFraisGestion: any | null
  vignetteUrl: string
  vignetteCreditPhoto: string
  vignetteTitre: string
  vignetteAlt: string
  partenaires: any[]
  versionsListeDePiece: any[]
  uniteDeGestion: AdemeUniteDeGestion
  listeDepense: any[]
  donneesPrevisionnelles: AdemeDonneesPrevisionnelles
  nomProjetObligatoire: boolean
  texteNomProjet: string | null
  texteDescriptionCourte: string | null
  texteDescription: string
  texteContexte: string
  texteObjectif: string
  eligibilite: AdemeEligibilite
  cahierDesChargesEtudes: any[]
  statut: string
  texteAideAuDepot: boolean
  aidesAuDepot: any[]
  courrielsAccuseReception: any[]
  caracterisation: AdemeCaracterisation
  prisEnChargePar: any[]
  motifVersion: string | null
  commentairesJuridiques: string
  commentairesFinanciers: string
  commentairesManager: string | null
  voletFinancier: AdemeVoletFinancier
}
