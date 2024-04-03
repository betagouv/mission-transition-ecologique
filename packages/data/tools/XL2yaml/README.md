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

3. Adpater les paramètres `FORCE_ALL` et les arguments `overwrite` pour savoir ce qui doit être mis à jour ou non. 

4. Lancer dans le répertoire du script `./XL2yaml.py`

## Dispositifs avec interventions manuelles

Le bloc publicodes de certains dispositifs ont été modifié manuellement, il s'agit exclusivement des conditions sur le secteur d'activité. 

Notamment, la règle "est dans un secteur d'activité éligible" est systématiquement renseignée manuellement. 

Les dispositifs concernés à ce stade :

- etude-diagnostic-serres
- imprim-vert
- pret-economies-d-energie-pee
- pret-vert-ademe
- pret-vert
- repar-acteurs

