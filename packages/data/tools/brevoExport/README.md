## XL2yaml

Cet outil est un script qui facilite l'export de donnée brevo en particulier en liant à chaque "deal" son "contact" associé ce qui n'est pas faisable via l'interface en ligne de brevo.

Il nous permet aussi d'harmoniser certaines des données exportées et de compenser certaines des modifications de format qui ont eu lieue depuis la création de la base de donnée BREVO.

## Mode d'emploi

1. Se placer dans le dossier courant ou hors du repo git. 
:warning: Génération de données privées. Ne pas ajouter les fichiers générés au repo git ! 

2. Installer les dépendances du script :
```bash
python -m venv .venv
source .venv/bin/activate
pip install sib_api_v3_sdk pytz
```

2. Autorisation l'execution du script
```bash
chmod +x ./brevoExport.py
```

3. Lancer dans le répertoire du script `./brevoExport.py`

