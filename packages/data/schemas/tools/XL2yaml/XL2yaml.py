#!./.venv/bin/python

import os
import random
import re
from typing import Any

import pylightxl
import yaml

INPUT_XL_FILE = "./dispositifs.xlsx"
WORKSHEET = "Data"
SKIP_XL_LINES = 5
OUTPUT_DIR = "../../../programs"


def printProgramYAML(rawData, colNumbers):
    cn = colNumbers

    def get(name):
        value = rawData[cn[name]]
        return curate(value)

    program = {
        "titre": get("Titre"),
        "promesse": get("Promesse"),
        "description": get("Description courte"),
    }
    if get("Description longue"):
        program["description longue"] = get("Description longue")

    program["illustration"] = randomIllustration()
    program["opérateur de contact"] = get("Opérateur de contact")

    autresOp = csvToList(get("Autres opérateurs"))
    if len(autresOp) >= 1:
        program["autres opérateurs"] = autresOp

    program["url"] = get("Lien en savoir+")
    program["nature de l'aide"] = get("💸 Nature de l'aide").lower()
    nat = program["nature de l'aide"]
    if nat == "financement":
        program["montant du financement"] = get("💰 Montant de l'aide")
    if nat == "accompagnement" or nat == "formation":
        program["coût de l'accompagnement"] = get("💰 Coût reste à charge")
        program["durée de l'accompagnement"] = get("⏱Prestation (durée + étalement)")
    if nat == "prêt":
        program["durée du prêt"] = get("Etalement")
        program[
            "montant du prêt"
        ] = f'De {thousandSep(get("MontantMin"))} € à {thousandSep(get("MontantMax"))} €'

    program["objectifs"] = makeObj(
        [get(f"🎯 {i} objectif") for i in ["1er", "2ème", "3ème", "4ème", "5ème"]]
    )

    program["publicodes"] = {}
    program["publicodes"]["afficher le dispositif si"] = {"toutes ces conditions": []}
    ec = pc_effectifConstraint(get("minEff"), get("maxEff"))
    if ec:
        program["publicodes"]["règles d'éligibilité"] = ec
        program["publicodes"]["afficher le dispositif si"][
            "toutes ces conditions"
        ].append("règles d'éligibilité")

    sc = pc_secteurActivitéConstraint(rawData, cn)
    if sc:
        program["publicodes"]["secteur d'activité prioritaire"] = sc
        program["publicodes"]["afficher le dispositif si"][
            "toutes ces conditions"
        ].append("secteur d'activité prioritaire")

    op = pc_objPrioritaire(rawData, cn)
    if op:
        program["publicodes"]["est dans les objectifs de l'entreprise"] = op
        program["publicodes"]["afficher le dispositif si"][
            "toutes ces conditions"
        ].append("est dans les objectifs de l'entreprise")

    # Si pas de condition, on affiche toujours
    if (
        len(program["publicodes"]["afficher le dispositif si"]["toutes ces conditions"])
        == 0
    ):
        program["publicodes"]["afficher le dispositif si"] = "oui"

    return convertToYaml(program)


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
    name = re.sub(r"[ _]", "-", name)
    name = re.sub(r"-+", "-", name)
    name = re.sub(r"-$", "", name)
    return name


def readXL(path):
    db = pylightxl.readxl(fn=path, ws=WORKSHEET)
    return db.ws(WORKSHEET)


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


def csvToList(input: str) -> list[str]:
    return [curate(s) for s in input.split(",") if valid(s)]


def makeObj(objs: list[str]):
    def keepObj(obj):
        return curate(obj) != "" and curate(obj) != "-"

    return [obj for obj in objs if keepObj(obj)]


def pc_effectifConstraint(effmin, effmax):
    constraint = []
    if valid(effmin) and effmin != 0:
        constraint.append(f"entreprise . effectif >= {effmin}")
    if valid(effmax):
        constraint.append(f"entreprise . effectif >= {effmax}")
    if len(constraint) == 0:
        return None
    else:
        return {"toutes ces conditions": constraint}


def pc_secteurActivitéConstraint(rawData, colNumbers):
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

    def get(name):
        value = rawData[colNumbers[name]]
        return curate(value)

    secteursInd = [bool(get(sect)) for sect in secteurs]

    if sum(secteursInd) == 0:
        return None

    return {
        "une de ces conditions": [
            f"entreprise . code NAF . est {s[0]}"
            for s, keep in zip(secteurs, secteursInd)
            if keep
        ]
    }


def pc_objPrioritaire(rawData, colNumbers):
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

    def get(name):
        value = rawData[colNumbers[name]]
        return curate(value)

    objPriInd = [bool(get(theme)) for theme in objPri.keys()]
    if sum(objPriInd) == 0:
        return None

    return {
        "une de ces conditions": [
            f"questionnaire . objectif prioritaire . {objectif}"
            for objectif, keep in zip(objPri.values(), objPriInd)
            if keep
        ]
    }


def thousandSep(value):
    return "{:,}".format(value).replace(",", " ")


def convertToYaml(d: dict):
    return yaml.safe_dump(d, allow_unicode=True, sort_keys=False)


if __name__ == "__main__":
    input = readXL(INPUT_XL_FILE)
    headerRowIndex = SKIP_XL_LINES + 1
    colNumbers = identifyColNumbers(input.row(headerRowIndex))

    for i, row in enumerate(input.rows):
        if i <= headerRowIndex:
            pass
        if row[4] == 1:
            id = forgeID(row[1])
            try:
                print(f"🖊️ {id}.yaml")
                with open(os.path.join(OUTPUT_DIR, f"{id}.yaml"), "x") as f:
                    f.write(printProgramYAML(row, colNumbers))
            except Exception:
                print(f"🖊️ {id}-2.yaml")
                with open(os.path.join(OUTPUT_DIR, f"{id}-2.yaml"), "x") as f:
                    f.write(printProgramYAML(row, colNumbers))

    # printProgramYAML(firstDataRow, colNumbers)
