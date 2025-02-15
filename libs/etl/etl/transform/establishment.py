def siren_establishment_to_db_establishment(establishment_document):
    """Extracts relevant establishment details from API response."""
    raw_establishment = establishment_document.get("etablissement", {})

    return {
        "siren": raw_establishment.get("siren", ""),
        "nic": raw_establishment.get("nic", ""),
        "siret": raw_establishment.get("siret", ""),
        "denomination": raw_establishment.get("uniteLegale", {}).get(
            "denominationUniteLegale", ""
        ),
        "creation_date": raw_establishment.get("uniteLegale", {}).get(
            "dateCreationUniteLegale", ""
        ),
        "naf_code": raw_establishment.get("uniteLegale", {}).get(
            "activitePrincipaleUniteLegale", ""
        ),
        "legal_category": raw_establishment.get("uniteLegale", {}).get(
            "categorieJuridiqueUniteLegale", ""
        ),
        "address": {
            "streetNumber": raw_establishment.get("adresseEtablissement", {}).get(
                "numeroVoieEtablissement", ""
            ),
            "streetType": raw_establishment.get("adresseEtablissement", {}).get(
                "typeVoieEtablissement", ""
            ),
            "streetLabel": raw_establishment.get("adresseEtablissement", {}).get(
                "libelleVoieEtablissement", ""
            ),
            "zipCode": raw_establishment.get("adresseEtablissement", {}).get(
                "codePostalEtablissement", ""
            ),
            "cityLabel": raw_establishment.get("adresseEtablissement", {}).get(
                "libelleCommuneEtablissement", ""
            ),
            "cityCode": raw_establishment.get("adresseEtablissement", {}).get(
                "codeCommuneEtablissement", ""
            ),
        },
        "workforce_range": raw_establishment.get("trancheEffectifsEtablissement", ""),
    }
