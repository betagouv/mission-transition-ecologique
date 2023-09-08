# Transition écologique des entreprises

![](https://img.shields.io/gitlab/license/45341092)

---

## `WARNING : work in progress`

---

**A web component and data to help french entreprises finding public aid 
programs for their ecological transition.**

A project from the `transition-ecologique-entreprises` SE team.

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

![](./packages/web/images/screenshots/screenshot-230602-a.png)


## Project Setup

This repository is a monorepo, based on [npm 
workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) composed of 
two workspaces:

- the ["web" workspace](./packages/web/README.md) contains the front-end implementations.
- the ["backend" workspace](./packages/backend/README.md) contains the back-end implementations.

### Install dependencies for all workspaces

```sh
npm install
```

### Environment variables 

Some environment vairables are needed for the services to work. Copy and 
modify the `example.env` file from the workspace you want to build/start to 
`.env` in the same directory.

### Build

```sh
# All workspaces
npm run build
# Or for a specific workspace
npm run build-front # web
npm run build-back  # backend

# Or alternatively
npm run build --workspace packages/{web,backend}
```

### Start services

```sh
# Front-end
WORKSPACE="web" npm run start
# Back-end
WORKSPACE="backend" npm run start

# Or alternatively
npm run start --workspace packages/{web,backend}
```


### Commands for a specific workspace

More scripts are defined for each workspace: checkout their respective 
documentation and `package.json` file.

Scripts can be triggered with:

```sh
npm run <script-name> -w packages/<workspace-name>
```

---

## Data validation

Source program data are stored as YAML files, we use [JSON Schema](https://json-schema.org/)
to validate every file.

The validations are triggered by Github CI on each pull request on preprod and 
main branches.

To run the validation tests manually, run:

```sh
npm run test-data -w packages/backend
```
