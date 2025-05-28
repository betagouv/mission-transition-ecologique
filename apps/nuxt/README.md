<div align="center">
  <img src="./public/images/logos/mission-transition-logo-alone.png" height="80px">
  <h3 align="center">
	<big>FRONTEND - Mission transition écologique</big>
  </h3>
  <p align="center">
   <a href="https://github.com/betagouv/mission-transition-ecologique/issues">Report Bug</a>
   •
   <a href="https://mission-transition-ecologique.beta.gouv.fr/">mission-transition-ecologique.beta.gouv.fr</a>
  </p>
</div>

---

## CSS - SCSS

La documentation des styles est disponible dans le fichier [`./style.md`](./style.md).

### Icônes DSFR

La documentation sur l'ajout de nouvelles icônes DSFR est disponible dans le fichier [`./src/assets/scss/dsfr/README.md`](./src/assets/scss/dsfr/README.md).

## Environment variables

The `env` variables you can use for deployment are listed in the `.env.example` file.

```env
# To set up global contact email
VITE_CONTACT_EMAIL = contact@mission-transition-ecologique.beta.gouv.fr

# To set up PostHog analytics
# create a posthog account and use the corresponding API key
POSTHOG_API_KEY = your_key
```

## Data models - (R&D)

All documentation about data models and references are on our [SE Notion space](https://www.notion.so/Accueil-93eb32ce96dc464cbdbe2154e13c8eea?pvs=4)

---

## Stack

- Type script
- Vuejs 3
- Vite
- Design System de l'Etat

### Technical references / tutorials

- create vue app + vite : https://github.com/vuejs/create-vue
- vue3 + typescript :
  - https://blog.logrocket.com/how-to-use-vue-3-typescript/
  - https://dev.to/nurlan_tl/tips-to-create-web-components-using-vue-3-ts-vite-3a7a
- vue + vite + nuxt + dsfr : https://github.com/laruiss/create-vue-dsfr
- vue3 composition API :
  - https://vuejs.org/guide/extras/composition-api-faq.html
  - https://vuejs.org/guide/reusability/composables.html
- issues templates : https://github.com/stevemao/github-issue-templates/tree/master

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### VSCode: Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension

- Run `Extensions: Show Built-in Extensions` from VSCode's command palette
- Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`

2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

---

## Project Setup

```sh
npm install
cp .env.example .env
```

### Development mode

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

Should run on `http://localhost:4242`

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

#### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

### Production Mode

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Run End-to-End Tests with [Cypress](https://www.cypress.io/) on Production Build

It's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```


#### Debug nuxt - ssr

###### Debugging the server

```ts
if (import.meta.server) {
  console.log()
}
```
