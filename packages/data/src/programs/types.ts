export enum Type {
  Accompagnement = "Accompagnement",  // 1724678
  TaxAdvantage = "Avantage fiscal",  // 1724679
  Financing = "Financement", // 80
  Loan = "Prêt", // 81
  Training = "Formation", // 82
  ActionTraining = "Formation-Action", // 83
  Awareness = "Sensibilisation", // 84
}

export enum Status {
  UxWritingValid = "UX writing valid",  // 1724685
  TaxAdvantage = "Data valid",  // 1724686
  ReadyForProd = "Prêt pour la prod", // 1724687
  InProd = "En prod", // 1724688
}


export interface Program {
  id: number
  "Id fiche dispositif": string
  "Identifiant fonctionnel": string
  "Titre": string
  "Promesse": string
  "Description courte": string
  "Description longue": string
  "Opérateur de contact": string[]
  "Dispositif activable en autonomie": boolean
  "Parcours \"Je ne sais pas par où commencer\"": boolean
  "URL externe": string
  "Coût reste à charge": string
  "Coût global": string
  "Montant de l'aide": string
  "Aides financières": string
  "MontantMin aide": string
  "MontantMax aide": string
  "Prestation (durée + étalement)": string
  "Durée estimé pour l'entreprise": string
  "Date de cloture intermédiaire": string
  "DISPOSITIF_DATE_DEBUT": string
  "DISPOSITIF_DATE_FIN": string
  "Zones Spécifiques (géographie)": string
  "Eligibilité Taille": string
  minEff: number
  maxEff: number
  microEntreprise: string
  "Eligibilité Existence": string
  "Eligibilité Naf": string
  "Eligibilité Sectorielle": string
  "Thèmes ADEME": string
  "Sous-thèmes ADEME": string
  "Type de projet ADEME": string
  "Propriétaire": string
  Surface: string
  "Mode trajet domicile-travail": string
  "Véhicule motorisé": string
  "TypeEssence, Elec...": string
  Dechet: string
  Tri: string
  Matières: string
  "Enjeu Eau": string
  Energie: string
  AuditEnvironnemental: string
  "Bilan GES /Carbon": string
  "Audit de performance énergétique des bâtiments ou Certification ISO 50001": string
  "Audit conso énergie": string
  "Audit Eau": string
  "Audit Dechet": string
  "Audit matières premières": string
  "Certification ISO 14001": string
  AAgriculture: string
  "BIndustries extractives": string
  CIndustrie: string
  "DProduction et distribution d'électricité, de gaz, de vapeur et d'air conditionné": string
  "EProduction et distribution d'eau, assainissement, gestion des déchets et dépollution": string
  FConstruction: string
  "GCommerce, réparation d'automobiles et de motocycles": string
  HTransports: string
  IHébergement: string
  JInformation: string
  KActivités: string
  LActivités: string
  MActivités: string
  NActivités: string
  OAdministration: string
  PEnseignement: string
  QSanté: string
  RArts: string
  SAutres: string
  TActivités: string
  UActivités: string
  "<5": string
  Entre5et20: string
  Entre20et50: string
  Entre50et250: string
  Plus250: string
  Stats: string
  "Indice Présence": string
  "Rénover son bâtiment": string
  "Economiser l'énergie": string
  "Economiser  l'eau": string
  "Réaliser un investissement pour décarbonner son matériel de production": string
  "Trier, réduire, recycler ses déchets ses déchets": string
  "Réaliser un diagnostic environnemental": string
  "Former ses collaborateurs": string
  "Eco-concevoir son produit": string
  "Décarboner son activité": string
  "Recruter pour réaliser sa transition": string
  "Titre historique au 01 Septembre 2023": string
  FRANCE_2030: string
  AAP_GROUPEMENT_TECHNIQUE_OPALE: string
  AAP_GROUPEMENT_COMPLEXITE: string
  DISPOSITIF_DATE_DERNIERE_MODIF: string
  AAP_ACRONYME: string
  DATE_MISE_A_JOUR_DONNEES: string
  "Lien supplémentaire": string
  "Type de dispositif": string
  "Année du dispositif": string
  Cibles: string
  EnergieConso: string
  "Date de création": string
  "Date de validation": string
  "Date de publication": string
  "Opérateur MAJ": string
  "Autres opérateurs": string[]
  "Couverture géographique": string
  "Zones géographiques": string[]
  "Eligibilité Spécifique": string
  "Thèmes Ciblés": string[]
  étape1: string
  étape2: string
  étape3: string
  étape4: string
  étape5: string
  étape6: string
  "Natude de l'aide": Type
  Statuts: Status[]
}
