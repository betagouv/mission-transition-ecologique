export interface TrainingSession {
  id: number
  type: string
  modality: string
  label: string
  city: string
  startDate: Date
  endDate: Date
  closingDate: Date
  durationHours: number
  durationDays: number
  minParticipants: number
  maxParticipants: number
}

export interface Training {
  id: string
  ID_technique_du_module: string
  Lien_URL_vers_la_fiche_programme: string
  Picto_de_la_thématique: string
  Chapeau_pour_site_web: string
  Libellé_de_la_formation: string
  Code_stage: string
  Type_de_formation: { _: string; id: string }
  Modalité_de_dispense: { _: string; id: string }
  Grandes_cibles: string
  Type_de_dispositif: { id: string }[]
  Id_section_code: { id: string }[]
  Thème: { _: string; id: string }
  Statut_de_publication: string
  Date_de_création: string
  Date_de_dernière_modification: string
  Au_catalogue_Qualiopi: { _: string; id: string }
  Conception: { _: string; id: string }
  Programme: string
  Public_cible: string
  Prérequis: string
  Objectifs_de_la_formation: string
  Modalités_et_moyens_pédagogiques: string
  Modalités_évaluation: string
  Equipe_pédagogique: string
  Durée_totale_en_heures: string
  Nombre_de_jours_de_formation: string
  Nombre_de_participants_minimum: string
  Nombre_de_participants_maximum: string
  Tarif_net_de_taxes: string
  Session_payante: string
  session?: TrainingSession[]
}
