# Artillery Load Testing with Playwright

Ce projet contient des tests de charge pour l'application TEE (Transition Écologique des Entreprises) utilisant Artillery et Playwright.

## Description

Les tests permettent de parcourir l'ensemble des pages suivantes :
- Accueil
- Liste des programmes d'aide
- Liste des projets
- Pages individuelles de programmes d'aide
- Pages individuelles de projets

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

## Installation

```bash
# Installer les dépendances
npm install

# Installer les navigateurs Playwright
npx playwright install
```

## Configuration

Le fichier `artillery.yml` contient la configuration des tests de charge. Vous pouvez modifier les paramètres suivants :

- **Environnements** : development, production, staging
- **Phases** : durée, taux d'arrivée, etc.
- **Options Playwright** : headless, etc.

## Exécution des tests

```bash
# Exécuter les tests en environnement de développement
npm run test:dev

# Exécuter les tests en environnement de production
npm run test:prod

# Exécuter les tests en environnement de staging
npm run test:staging
```

Ou directement avec Artillery :

```bash
# Développement
npx artillery run -e development artillery.yml

# Production
npx artillery run -e production artillery.yml

# Staging
npx artillery run -e staging artillery.yml
```

## Structure des tests

Les tests sont divisés en deux scénarios :

1. **HTTP requests scenario** : Effectue des requêtes HTTP simples sur les différentes pages
2. **Browser navigation scenario** : Utilise Playwright pour naviguer dans le navigateur et interagir avec les pages

Le script Playwright (`src/browse-pages.js`) effectue les actions suivantes :
- Visite la page d'accueil
- Visite la liste des programmes d'aide
- Visite la liste des projets
- Visite jusqu'à 3 pages individuelles de programmes d'aide
- Visite jusqu'à 3 pages individuelles de projets

## Rapports

Après l'exécution des tests, un rapport HTML est généré dans le répertoire `reports/`.

```bash
# Ouvrir le dernier rapport généré
open reports/report.html
```

## Références

- [Documentation Artillery](https://www.artillery.io/docs)
- [Documentation Playwright avec Artillery](https://www.artillery.io/docs/reference/engines/playwright)
