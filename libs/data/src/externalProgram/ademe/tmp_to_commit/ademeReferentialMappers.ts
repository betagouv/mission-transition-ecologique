// Hardcoded mappings from ADEME referential codes to labels

export class AdemeReferentialMappers {
  private static readonly COUVERTURE_GEO_MAP: Record<string, string> = {
    '1': 'National',
    '2': 'Européen',
    '3': 'International',
    '4': 'Régional'
  }

  private static readonly ZONE_GEO_MAP: Record<string, string> = {
    '01': 'Guadeloupe',
    '02': 'Martinique',
    '03': 'Guyane',
    '04': 'La Réunion',
    '06': 'Mayotte',
    '11': 'Île-de-France',
    '24': 'Centre-Val de Loire',
    '27': 'Bourgogne-Franche-Comté',
    '28': 'Normandie',
    '32': 'Hauts-de-France',
    '44': 'Grand Est',
    '52': 'Pays de la Loire',
    '53': 'Bretagne',
    '75': 'Nouvelle-Aquitaine',
    '76': 'Occitanie',
    '84': 'Auvergne-Rhône-Alpes',
    '93': "Provence-Alpes-Côte d'Azur",
    '94': 'Corse',
    '975': 'Saint-Pierre-Et-Miquelon',
    '977': 'Saint-Barthélemy',
    '978': 'Saint-Martin',
    '984': 'Terres australes et antarctiques françaises',
    '986': 'Wallis et Futuna',
    '987': 'Polynésie française',
    '988': 'Nouvelle-Calédonie',
    '989': 'Ile de Clipperton'
  }

  private static readonly THEMATIQUE_MAP: Record<string, string> = {
    ALIBIO: 'Alimentation / biodéchets',
    AUT: 'Autres',
    BOIBIO: 'Bois, biomasse énergie …',
    CCL: 'Changement climatique',
    DEMTER: 'Démarches territoriales',
    ECD: 'Economie circulaire / Déchets',
    ECO: 'Eco-conception',
    EFFENR: 'Efficacité énergétique',
    ENR: 'Energie',
    ENRAUT: 'Energie (Autres)',
    GEOTER: 'Géothermie',
    HRBTOU: 'Hébergement touristique',
    MTR: 'Mobilité / Transport',
    PRODUR: 'Production durable',
    QUA: "Qualité de l'air",
    RECCHA: 'Récupération de chaleur',
    REEREP: 'Réemploi, réparation',
    RESCHF: 'Réseaux de chaleur et de froid',
    RESTAU: 'Restauration',
    SAF: 'Sols / Agriculture / Forêt',
    SLOTOU: 'Slow tourisme',
    SOLAIR: 'Solaire',
    TOU: 'Tourisme durable',
    TRIREC: 'Tri et recyclage',
    UBA: 'Urbanisme / Bâtiment',
    VALENR: 'Valorisation énergétique'
  }

  private static readonly CIBLE_MAP: Record<string, string> = {
    SCA1: 'Association',
    SCA2: 'Collectivités et secteur public',
    SCA3: 'Entreprise',
    SCA4: 'Organisme de recherche'
  }

  private static readonly TYPE_PROJET_MAP: Record<string, string> = {
    ANCOF: 'Animation / Communication / Formation',
    ETAMO: "Etudes - Assistant maitrise d'ouvrage",
    ETDEF: 'Etudes - Diagnostic et études de faisabilité',
    ETETG: 'Etudes - Etudes générales',
    INVES: 'Investissement',
    REINNO: 'Recherche et Innovation'
  }

  static mapCouvertureGeo(code: string): string {
    return this.COUVERTURE_GEO_MAP[code] || code
  }

  static mapZoneGeo(code: string): string {
    return this.ZONE_GEO_MAP[code] || code
  }

  static mapThematique(code: string): string {
    return this.THEMATIQUE_MAP[code] || code
  }

  static mapCible(code: string): string {
    return this.CIBLE_MAP[code] || code
  }

  static mapTypeProjet(code: string): string {
    return this.TYPE_PROJET_MAP[code] || code
  }

  static mapZoneGeoCodes(codes: string[]): string[] {
    return codes.map((code) => this.mapZoneGeo(code))
  }

  static mapThematiqueCodes(codes: string[]): string[] {
    return codes.map((code) => this.mapThematique(code))
  }

  static mapCibleCodes(codes: string[]): string[] {
    return codes.map((code) => this.mapCible(code))
  }

  static mapTypeProjetCodes(codes: string[]): string[] {
    return codes.map((code) => this.mapTypeProjet(code))
  }
}
