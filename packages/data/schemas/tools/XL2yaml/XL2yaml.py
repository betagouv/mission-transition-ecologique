#!./.venv/bin/python

import os
import random
import re
import sys
from pathlib import Path
from typing import Any

import pylightxl
import yaml

INPUT_XL_FILE = "./dispositifs.xlsx"
WORKSHEET = "DataProd"
SKIP_XL_LINES = 5
OUTPUT_DIR = "../../../programs"


CIBLE = "entreprise . est ciblée"
ELIGIBLE = "entreprise . est éligible"
OBJECTIF = "entreprise . a un objectif ciblé"
SECTEUR = "entreprise . est dans un secteur d'activité ciblé"
ZONE_GEO = "entreprise . est dans une zone géographique éligible"
EFFECTIF = "entreprise . a un effectif éligible"
MODE_TRANSPORT = "entreprise . utilise un mode de transport ciblé"
POSSESSION_VEHICULES = "entreprise . possède des véhicules motorisés"
PARCOURS_OBJ_PRECIS = "questionnaire . parcours = objectif précis"
PROPRIO = "entreprise . est propriétaire de ses locaux"

ELIGIBILITY_SIZE = "taille de l'entreprise"

ALL = "toutes ces conditions"
ANY = "une de ces conditions"


def remove_namespace(s):
    return "".join(s.split(" . ")[1:])


def assembleProgramYAML(rawData, colNumbersByName, id):
    def get(name):
        value = rawData[colNumbersByName[name]]
        return curate(value)

    try:
        existingProgram = readFromYaml(Path(OUTPUT_DIR, f"{id}.yaml"))
    except:  # noqa
        existingProgram = {}

    prog = {}

    FORCE_ALL = False

    # Only sets the key if key does not exist.
    # if force = True, then replaces the key even if it exists
    def set(key, value, overwrite=FORCE_ALL):
        if overwrite or key not in existingProgram:
            prog[key] = value
        else:
            prog[key] = existingProgram[key]

    set("titre", get("Titre"))
    set("promesse", get("Promesse"))
    set("description", get("Description courte"))

    if get("Description longue"):
        set("description longue", get("Description longue"))

    if valid(get("DISPOSITIF_DATE_DEBUT")):
        set("début de validité", get("DISPOSITIF_DATE_DEBUT"))
    if valid(get("DISPOSITIF_DATE_FIN")):
        set("fin de validité", get("DISPOSITIF_DATE_FIN"))

    set("illustration", randomIllustration())
    set("opérateur de contact", get("Opérateur de contact"))

    autresOp = csv_to_list(get("Autres opérateurs"))
    if len(autresOp) >= 1:
        set("autres opérateurs", autresOp)

    set("url", get("Lien en savoir+"))
    set("nature de l'aide", get("💸 Nature de l'aide").lower())
    nat = prog["nature de l'aide"]
    if nat == "financement":
        set("montant du financement", get("💰 Montant de l'aide"))
    if nat == "accompagnement" or nat == "formation":
        set("coût de l'accompagnement", get("💰 Coût reste à charge"))
        set("durée de l'accompagnement", get("⏱Prestation (durée + étalement)"))
    if nat == "prêt":
        set("durée du prêt", get("Etalement"))
        set(
            "montant du prêt",
            f'De {thousandSep(get("MontantMin aide"))} € à {thousandSep(get("MontantMax aide"))} €',
        )
    if nat == "avantage fiscal":
        set("montant de l'avantage fiscal", get("💰 Montant de l'aide"))

    objectifs = makeObj(
        [get(f"🎯 {i} objectif") for i in ["1er", "2ème", "3ème", "4ème", "5ème"]]
    )
    set("objectifs", objectifs)

    pc = {}
    cible = []  # Accumulateur des règles qui font parti du ciblage.
    eligibilite = []  # Accumulateur des règles qui font parti de l'éligibilité.

    # Conditions d'éligibilité
    eligibility_conditions = {ELIGIBILITY_SIZE: []}
    eligibility_conditions[ELIGIBILITY_SIZE].append("Toutes tailles")
    eligibility_conditions[ELIGIBILITY_SIZE].append("Éligible aux micro-entreprises")

    set("conditions d'éligibilité", eligibility_conditions, True)

    # Publicodes constraints
    effective_constraint = pc_effectifConstraint(get("minEff"), get("maxEff"))
    if effective_constraint:
        pc[EFFECTIF] = effective_constraint
        eligibilite.append(remove_namespace(EFFECTIF))

    sc = pc_secteurActivitéConstraint(get)
    if sc:
        pc[SECTEUR] = sc
        cible.append(remove_namespace(SECTEUR))

    op = pc_objPrioritaire(get)
    if op:
        pc[OBJECTIF] = op
        cible.append(remove_namespace(OBJECTIF))

    reg = pc_regions(get)
    if reg:
        pc[ZONE_GEO] = reg
        eligibilite.append(ZONE_GEO)

    mod = pc_mode_transport(get)
    if mod:
        pc[MODE_TRANSPORT] = mod
        cible.append(remove_namespace(MODE_TRANSPORT))

    veh = pc_possede_vehicule(get)
    if veh:
        cible.append(remove_namespace(POSSESSION_VEHICULES))

    p360 = pc_onlyPrecise(get)
    if p360:
        cible.append(PARCOURS_OBJ_PRECIS)

    own = pc_building_owner(get)
    if own:
        cible.append(PROPRIO)

    if len(eligibilite) != 0:
        cible = [remove_namespace(ELIGIBLE)] + cible

    publicodes_obj = {}
    # Si pas de condition, on affiche toujours
    if len(cible) == 0:
        publicodes_obj[CIBLE] = "oui"
    else:
        publicodes_obj[CIBLE] = {ALL: cible}

    if len(eligibilite) != 0:
        publicodes_obj[ELIGIBLE] = {ALL: eligibilite}

    publicodes_obj |= pc

    set("publicodes", publicodes_obj)

    return convertToYaml(prog)


def remove_special_chars(text: str) -> str:
    t = re.sub(r'("[^"]+")|[-\']', r"\1 ", text)
    t = re.sub(r'("[^"]+")|[^\w ]', r"\1 ", t)

    return t


def remove_accents(text: str) -> str:
    """Remove accents removes accents on voyels.

    It does not deal with æ, ñ etc. Consult code for exact substitutions.
    """
    t = re.sub(r"[èéêë]", "e", text)
    t = re.sub(r"[àáâãäå]", "a", t)
    t = re.sub(r"[ìíîï]", "i", t)
    t = re.sub(r"[òóôõö]", "o", t)
    t = re.sub(r"[ùúûü]", "u", t)
    t = re.sub(r"[ÈÉÊË]", "E", t)
    t = re.sub(r"[ÀÁÂÃÄÅ]", "A", t)
    t = re.sub(r"[ÌÍÎÏ]", "I", t)
    t = re.sub(r"[ÒÓÔÕÖ]", "O", t)
    t = re.sub(r"[ÙÚÛÜ]", "U", t)
    t = re.sub(r"ç", "c", t)
    return t


def forgeID(name):
    name = name.lower()
    name = remove_special_chars(name)
    name = remove_accents(name)
    name = re.sub(r"[ _'&]", "-", name)
    name = re.sub(r"-+", "-", name)
    name = re.sub(r"-$", "", name)
    name = re.sub(r"\"", "", name)
    return name


def readXL(path, worksheet):
    db = pylightxl.readxl(fn=path, ws=worksheet)
    return db.ws(worksheet)


def identifyColNumbers(header: list[Any]):
    return {h: i for h, i in zip(header, range(len(header)))}


def randomIllustration():
    illustrations = [
        "images/TEE_energie_verte.png",
        "images/TEE_ampoule.png",
        "images/TEE_eolienne.png",
    ]
    return illustrations[random.randint(0, 2)]


def curate(value):
    curated = value
    if isinstance(value, str):
        curated = curated.strip()
    return curated


def valid(value):
    if curate(value) == "-" or curate(value) == "*" or curate(value) == "":
        return False
    return True


def csv_to_list(input: str) -> list[str]:
    return [curate(s) for s in re.split(r",|\|", input) if valid(s)]


def makeObj(objs: list[str]):
    def keepObj(obj):
        return curate(obj) != "" and curate(obj) != "-"

    return [obj for obj in objs if keepObj(obj)]


def pc_effectifConstraint(effmin, effmax):
    constraint = []
    if valid(effmin) and effmin != 0:
        constraint.append(f"effectif >= {effmin}")
    if valid(effmax):
        constraint.append(f"effectif <= {effmax}")
    if len(constraint) == 0:
        return None
    else:
        return {ALL: constraint}


def pc_secteurActivitéConstraint(get):
    secteurs = [
        "AAgriculture, sylviculture et pêche",
        "BIndustries extractives",
        "CIndustrie manufacturière",
        "DProduction et distribution d'électricité, de gaz, de vapeur et d'air conditionné",
        "EProduction et distribution d'eau, assainissement, gestion des déchets et dépollution",
        "FConstruction",
        "GCommerce, réparation d'automobiles et de motocycles",
        "HTransports et entreposage",
        "IHébergement et restauration",
        "JInformation et communication",
        "KActivités financières et d'assurance",
        "LActivités immobilières",
        "MActivités spécialisées, scientifiques et techniques",
        "NActivités de services administratifs et de soutien",
        "OAdministration publique",
        "PEnseignement",
        "QSanté humaine et action sociale",
        "RArts, spectacles et activités récréatives",
        "SAutres activités de services",
        "TActivités des ménages en tant qu'employeurs, activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre",
        "UActivités extra-territoriales",
    ]

    secteursInd = [bool(get(sect)) for sect in secteurs]

    if sum(secteursInd) == 0:
        return None

    return {
        "une de ces conditions": [
            f"code NAF niveau 1 . est {s[0]}"
            for s, keep in zip(secteurs, secteursInd)
            if keep
        ]
    }


def pc_objPrioritaire(get):
    objPri = {
        "🏢\nBâtiment": "est rénover mon bâtiment",
        "🚲\nMobilité": "est la mobilité durable",
        "🗑\nDéchets": "est la gestion des déchets",
        "💧\nEau": "est diminuer ma consommation d'eau",
        "⚡️\nEnergie": "est ma performance énergétique",
        "🧑‍🎓\nRH": "est former ou recruter",
        "🌱\nStratégie": "est mon impact environnemental",
        "🏭\nProduction": "est l'écoconception",
    }

    objPriInd = [bool(get(theme)) for theme in objPri.keys()]
    if sum(objPriInd) == 0:
        return None

    return {
        ANY: [
            f"questionnaire . objectif prioritaire . {objectif}"
            for objectif, keep in zip(objPri.values(), objPriInd)
            if keep
        ]
    }


def pc_mode_transport(get):
    modes = csv_to_list(get("Mode trajet domicile-travail"))

    if len(modes) == 0:
        return None

    return {
        ANY: [
            f"mode de transport domicile-travail . est {mode.lower()}" for mode in modes
        ]
    }


def pc_possede_vehicule(get):
    possede_vehicule = valid(get("Véhicule motorisé"))

    if not possede_vehicule:
        return None

    return True


def pc_regions(get):
    regions = csv_to_list(get("Zones géographiques Régional"))

    if len(regions) == 0:
        return None

    return {ANY: [f"région = {region}" for region in regions]}


def pc_onlyPrecise(get):
    shouldShowOnPreciseOnly = not bool(
        get('Parcours "Je ne sais pas par où commencer"')
    )

    if not shouldShowOnPreciseOnly:
        return None

    return True


def pc_building_owner(get):
    shouldAddressBuildingOwner = valid(get("Propriétaire"))
    if not shouldAddressBuildingOwner:
        return None
    return True


def thousandSep(value):
    return "{:,}".format(value).replace(",", " ")


def convertToYaml(d: dict):
    return yaml.safe_dump(d, allow_unicode=True, sort_keys=False)


def readFromYaml(program_path: Path):
    with open(program_path, "r") as f:
        program = yaml.safe_load(f)
    return program


if __name__ == "__main__":
    if len(sys.argv) > 1:
        worksheet = sys.argv[1]
    else:
        worksheet = WORKSHEET

    input = readXL(INPUT_XL_FILE, worksheet)
    headerRowIndex = SKIP_XL_LINES + 1
    colNumbers = identifyColNumbers(input.row(headerRowIndex))

    all_ids = set()
    for i, row in enumerate(input.rows):
        if i <= headerRowIndex:
            pass
        if row[6] == 1:
            id = row[1]
            if id == "":
                id = forgeID(row[3])

            if id in all_ids:
                raise Exception("Duplicate ID !")
            all_ids.add(id)

            print(f"🖊️ {id}.yaml")
            prog = assembleProgramYAML(row, colNumbers, id)
            with open(os.path.join(OUTPUT_DIR, f"{id}.yaml"), "w") as f:
                f.write(prog)
