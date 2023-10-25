## XL2yaml

Cet outil est un script pour extraire, à partir d'un fichier excel 
représentant les dispositifs, une ligne pour la convertir en fichier yaml.

Il est non testé, et n'a pas vocation à être maintenu, uniquement de servir 
d'exemple si la situation devait se reproduire de devoir migrer des données 
d'un format à un autre.

## Mode d'emploi

1. Télécharger dans le répertoire du script le fichier excel des dispositifs 
   sous le nom "dispositifs.xlsx"

2. Installer les dépendances du script :

```bash
python -m venv .venv
source .venv/bin/activate
pip install pylightxl
pip install pyyaml
```

3. Supprimer les fichiers de programme à remplacer dans 
   "./packages/data/programs"

4. `./XL2yaml.py`
