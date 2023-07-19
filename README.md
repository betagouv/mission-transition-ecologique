# Transition écologique des entreprises

![](https://img.shields.io/gitlab/license/45341092)

---

## `WARNING : work in progress`

---

**A web component to help french entreprises finding public aid programs for 
their ecological transition.**

A project from the `transition-ecologique-entreprises` SE team.

--- 

<div style="display: flex; flex-direction: row;">
  <img src="./images/logos/republique_francaise_rvb-1536x1392.webp" height="100px">
  <img src="./images/logos/logoademe2020_gb_rvb.webp" height="100px">
  <img src="./images/logos/95886_289860.webp" height="100px">
  <img src="./images/logos/logo_twitter_image-2019.jpg" height="75px">
</div>

--- 

## Screenshots

![](./packages/web/images/screenshots/screenshot-230602-a.png)


## Project Setup

This repository is a monorepo, based on [npm 
workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) composed of 
two workspaces:

- the ["web" workspace](./packages/web/README.md) contains the front-end implementations.

### Install dependencies for all repositories

```sh
npm install
```

### Build for all workspaces

```sh
npm run build
```


### Commands for a specific workspace

More scripts are define for each workspace: checout their respective 
documentation. 

Scripts can be triggered with:

```sh
npm run <script-name> -w packages/<workspace-name>
```
