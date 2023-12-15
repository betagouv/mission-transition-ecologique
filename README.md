# Transition écologique des entreprises

![](https://img.shields.io/gitlab/license/45341092)

---

## `WARNING : work in progress`

---

**An app + a web component + a dataset to help french entreprises finding public aid programs for their ecological transition.**

A project from the `transition-ecologique-entreprises` SE team.

- [Screenshots](#screenshots)
- [Project Setup](#project-setup)
  - [Stack](#stack)
  - [Description](#description)
  - [Getting started](#getting-started)
    - [NVM](#nvm)
    - [Environment variables](#environment-variables)
    - [Quick Start](#quick-start)
    - [Build](#build)
    - [Start services](#start-services)
    - [Development Mode](#development-mode)
    - [Commands for a specific workspace](#commands-for-a-specific-workspace)
- [Data validation](#data-validation)
- [Credits](#credits)
--- 

<div style="display: flex; flex-direction: row;">
  <img 
src="./packages/web/images/logos/republique_francaise_rvb-1536x1392.webp" 
height="100px">
  <img src="./packages/web/images/logos/logoademe2020_gb_rvb.webp" 
height="100px">
  <img src="./packages/web/images/logos/95886_289860.webp" height="100px">
  <img src="./packages/web/images/logos/logo_twitter_image-2019.jpg" 
height="75px">
</div>

--- 

## Screenshots

![](./packages/web/images/screenshots/screenshot-2023-11-29-a.png)

## Project Setup

### Stack

- [NodeJS](https://nodejs.org/) (v18)
- Back: [Express](http://expressjs.com/) (v4)
- Front: [VueJS](https://vuejs.org/) (v3)
  - Design system: [DSFR](https://www.systeme-de-design.gouv.fr/) 

### Description

This repository is a monorepo, based on [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) composed of two workspaces:

- the ["web" workspace](./packages/web/README.md) contains the front-end implementations.
- the ["backend" workspace](./packages/backend/README.md) contains the back-end implementations.
- the ["data" workspace](./packages/data/README.md) contains the datasets and common files for datasets builds.

## Getting started

### NVM

The runtime is Node 18.x for this application.  
You can use [nvm](https://github.com/nvm-sh/nvm) to install this specific version.

```sh
# from the root folder of the project
nvm install
nvm use
```

### Environment variables

Some environment variables are needed for the services to work. Copy and modify the `.env.example` file from the folders (`back`/`data`/`web`) you want to build/start to `.env` in the same directory.

### Quick Start

If you want to run the project locally and quickly, you can use the following commands:

```sh
# from the root folder of the project
npm install
npm run start-all
```

- Go to http://localhost:4242/ to access the front-end

### Build

Use the following commands to build the project:

```sh
# All workspaces
npm run build
# Or for a specific workspace
npm run build-front # web
npm run build-back  # backend

# Or alternatively
npm run build -w packages/web
npm run build -w packages/backend
```

### Start services

Use the following commands to start the project:

```sh
# All workspaces
npm run start-all
# Or for a specific workspace
# Front-end
npm run start-front
# Back-end
npm run start-back

# Or alternatively
PORT=4242 npm run start --workspace packages/web
npm run start --workspace packages/backend
```

### Development Mode

To run the project in development mode, use the following commands:

```sh
# All workspaces
npm run dev
# Or for a specific workspace
# Front-end
npm run dev-front
# Back-end
npm run dev-back

# Or alternatively
npm run dev --workspace packages/web
npm run dev --workspace packages/backend
```

#### Linting

```sh
# All workspaces with fix
npm run lint
# All workspaces without fix
npm run lint-check
# Type check on web workspace
npm run type-check --workspace packages/web
# Type check on web workspace with watch mode
npm run type-check-watch --workspace packages/web
```

### Preview front before deploying in production

```sh
# This script builds the front 
# and previews the produced index.html file from the dist folder
# on http://localhost:4242
npm run build-and-preview-front
```

### Commands for a specific workspace

More scripts are defined for each workspace: checkout their respective documentation and `package.json` file.

- backend: [README](./packages/backend/README.md) / [package.json](./packages/backend/package.json)
- data: [README](./packages/data/README.md) / [package.json](./packages/data/package.json)
- web: [README](./packages/web/README.md) / [package.json](./packages/web/package.json)

Scripts can be triggered with:

```sh
npm run <script-name> -w packages/<workspace-name>
```

---

## Data validation

Source program data are stored as YAML files, we use [JSON Schema](https://json-schema.org/) to validate every file.

The validations are triggered by Github CI on each pull request on preprod and main branches.

To run the validation tests manually, run:

```sh
npm run test-data -w packages/backend
```

---

## Credits

- Team
  - Product owner: Jean-Baptiste Le Dévéhat
  - Coaching: Julien Rayneau
  - Designers: Coline Lebaratoux
  - Maintainers:
    - Pierre Camilleri
    - Julien Paris
    - Yohann Valentin
