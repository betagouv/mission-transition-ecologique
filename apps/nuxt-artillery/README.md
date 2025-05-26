# Artillery Load Testing with Playwright

Ce projet contient des tests de charge pour l'application TEE (Transition Écologique des Entreprises) utilisant Artillery et Playwright avec TypeScript.

## Description

Les tests permettent de parcourir l'ensemble des pages suivantes :
- Accueil
- Liste des programmes d'aide
- Liste des projets
- Pages individuelles de programmes d'aide
- Pages individuelles de projets

## Configuration

Le projet utilise deux fichiers de configuration Artillery :

1. `artillery-page.yml` - Pour les tests de navigation avec Playwright. Parcours, la page d'accueil et l'ensemble des pages dispositifs et projets.
2. `artillery-load-test.yml` - Pour les tests de charge HTTP

## Exécution des tests

Depuis la racine du projet, utilisez les commandes suivantes :

```bash
# Tests de navigation avec Playwright
# Environnement de développement
npm run artillery:page:dev

# Environnement de staging
npm run artillery:page:staging

# Environnement de production
npm run artillery:page:prod

# Tests de charge HTTP
# Environnement de développement
npm run artillery:load:dev

# Environnement de staging
npm run artillery:load:staging

# Environnement de production
npm run artillery:load:prod
```

Ou directement avec Artillery (depuis le répertoire apps/nuxt-artillery) :

```bash
# Tests de navigation avec Playwright
# Développement
npx artillery run -e development artillery-page.yml

# Production
npx artillery run -e production artillery-page.yml

# Staging
npx artillery run -e staging artillery-page.yml

# Tests de charge HTTP
# Développement
npx artillery run -e development artillery-load-test.yml

# Production
npx artillery run -e production artillery-load-test.yml

# Staging
npx artillery run -e staging artillery-load-test.yml
```

## Structure des tests

Les tests sont organisés selon une architecture orientée objet (OOP) en TypeScript :

1. **Tests de navigation (artillery-page.yml)** : Utilise Playwright pour naviguer dans le navigateur et interagir avec les pages
2. **Tests de charge HTTP (artillery-load-test.yml)** : Effectue des requêtes HTTP simples sur les différentes pages

### Architecture des classes

Le script principal `src/browse-pages.ts` utilise les classes suivantes :

- `BasePage` : Classe abstraite de base pour toutes les pages
- `Homepage` : Gère la navigation sur la page d'accueil
- `Programs` : Gère la navigation sur la page des programmes d'aide et les pages individuelles
- `Projects` : Gère la navigation sur la page des projets et les pages individuelles

Chaque classe est responsable de sa propre logique de navigation et d'interaction.

## Références

- [Documentation Artillery](https://www.artillery.io/docs)
- [Documentation Playwright avec Artillery](https://www.artillery.io/docs/reference/engines/playwright)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
