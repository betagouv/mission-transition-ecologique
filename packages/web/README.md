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
### Les couleurs
La plupart des couleurs utilisées dans le projet sont celles du [Design System de l'Etat](https://design-system.gouv.fr/): [Palette de couleurs du dsfr](https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-de-l-identite-de-l-etat/couleurs-palette)

#### [Les couleurs personnalisées](./src/assets/scss/setting/_color.scss)
Certaines couleurs ont été ajoutées pour les besoins du projet. Et sont gérées dans le fichier `src/assets/scss/setting/_color.scss`.  

Pour utiliser les couleurs personnalisées, vous pouvez indiquer leur nom de variable. Voici comment faire :

1. Utilisation directe : Vous pouvez utiliser directement la couleur en la référençant par son nom de variable. Par exemple, pour utiliser `$base-yellow` comme couleur de fond, vous pouvez écrire :

```scss
@use './src/assets/scss/setting';

.element {
  background-color: setting.$base-yellow;
}
```

2. Utilisation à travers le tableau `$colors` et de la fonction `map-get`. 

Exemple, pour obtenir la couleur de fond pour "yellow" :
```scss
@use './src/assets/scss/setting';

.element {
  background-color: map-get(map-get(setting.$colors, "yellow"), "background-color");
}
```

3. Utilisation avec une boucle via le tableau `$colors`:

Exemple, pour définir la couleur de fond pour chaque couleur :
```scss
@use './src/assets/scss/setting';

@each $color, $properties in setting.$colors {
  .element-#{$color} {
    background-color: map-get($properties, "background-color");
  }
}
```

### Outils d'affichage

#### Alignement des textes  
Les classes `.fr-text-[align]` permettent de définir l'alignement du texte. Voici comment les utiliser :

Valeurs possibles pour `[align]`:
- `left` : alignement à gauche
- `center` : alignement au centre
- `right` : alignement à droite
- `justify` : justifié

1. Utilisation de base : avec la classe `.fr-text-[align]` à ajouter à l'élément HTML.

Exemple, pour aligner un texte à droite :
```html
<p class="fr-text-right">...</p>
```

2. Utilisation avec des breakpoints différentes : avec la classe `.fr-text-[align]-[breakpoint]`.

Valeurs possibles pour `[breakpoint]`:
- `xs` : pour les écrans de très petite taille
- `sm` : pour les écrans de petite taille
- `md` : pour les écrans de taille moyenne
- `lg` : pour les écrans de grande taille
- `xl` : pour les écrans très grands

Exemple, pour aligner un texte à gauche sur les écrans de taille moyenne et plus :
```html
<p class="fr-text-left-md">...</p>
```

### L'arrondie des coins
La classe `.fr-radius-[corner]` permet d'appliquer un rayon de bordure à un coin spécifique d'un élément. Voici comment l'utiliser :

Valeurs possibles pour `[corner]`:
- `tl` : coin supérieur gauche
- `tr` : coin supérieur droit
- `bl` : coin inférieur gauche
- `br` : coin inférieur droit
- `t` : coins supérieurs
- `b` : coins inférieurs
- `l` : coins gauches
- `r` : coins droits
- `a` : tous les coins

1. Utilisation de base : avec la classe `.fr-radius-[corner]` à ajouter à l'élément HTML.  

Exemple, pour appliquer un rayon de bordure au coin supérieur gauche d'un élément :
```html
<div class="fr-radius-tl">...</div>
```

2. Utilisation avec différentes tailles : avec la classe `.fr-radius-[corner]-[rounded]` afin de preciser la taille de rayon.

Valeurs possibles pour `[rounded]`:
- `0` : rayon de 0rem
- `0-5v` : rayon de 0.5rem
- `1v` : rayon de 1rem
- `1-5v` : rayon de 1.5rem
- `2v` : rayon de 2rem
- `2-5v` : rayon de 2.5rem

Exemple, pour appliquer un petit rayon au coin supérieur droit :
```html
<div class="fr-radius-tr-0-5v">...</div>
```

### Les tags de couleurs
L'utilisation de la classe `.fr-tag--[color]` en combinaison avec `.fr-tag`  permet de changer la couleur de fond du tag lorsque le tag a été sélectionné. Remplacez [color] par le nom de la couleur souhaitée.

Exemple, pour un tag avec une couleur de fond bleue lorsqu'il est sélectionné :
```html
<div class="fr-tag fr-tag--blue">...</div>
```

### Les cartes de couleurs
L'utilisation de la classe `.fr-card--[color]` en combinant avec `.fr-card` permet de changer la couleur de fond de la carte. Remplacez [color] par le nom de la couleur souhaitée.  
Cette classe est, par exemple, utilisée pour l'affichage des cartes Objectif sur le component [`TeeObjectiveCard`](./src/components/element/TeeObjectiveCard.vue).

Exemple, pour une carte avec une couleur de fond bleue :
```html
<div class="fr-card fr-card--blue">...</div>
```

## Environment variables

The `env` variables you can use for deployment are listed in the `.env.example` file.

```env
# To hide the "debug" switch
# If this variable is set to 'true'
# it overrides the `debug-switch` parameters to prohibit debug mode
VITE_NO_DEBUG_SWITCH = false

# To indicate built source while copying the widget
VITE_DEPLOY_URL = https://tee-frontend.osc-fr1.scalingo.io

# To set up global contact email
VITE_CONTACT_EMAIL = contact@mission-transition-ecologique.beta.gouv.fr

# To set up Matomo analytics
# Note : if VITE_MATOMO_DEACTIVATE is set to 'true' it prohibits the tracking
# even if VITE_MATOMO_URL and VITE_MATOMO_APP_ID are correctly set
VITE_MATOMO_DEACTIVATE = true
VITE_MATOMO_URL = https://stats.beta.gouv.fr
VITE_MATOMO_APP_ID = 42

# To indicate the backend url
VITE_TEE_BACKEND_URL=https://tee-backend.osc-fr1.scalingo.io
```

---

## Legacy projects

- Aides territoires + Mission transition
  - http://mission-transition.beta.gouv.fr/
  - http://mission-transition.beta.gouv.fr/integration

## Projet TEE

- https://www.figma.com/file/tHgzORFkJYTVspsQgR2kg6/TEE-V5
- https://docs.google.com/presentation/d/1zP32OOaRsVEgPTaIXjWUxq3DccR79m4Zv8blfJa-0vQ/edit#slide=id.g22df2b368bb_0_655
- https://whimsical.com/offres-aux-entreprises-dans-la-tee-2gHnT3nFgRZs32pa7aYmPL

## Aid programs APIs

- API - Liste des aides Entreprises sur AGIR :
  - https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/recherche?aap%5B0%5D=vous_etes%3AEntreprise
  - https://ppd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/r2da/listeDispositif (needs client secret token)
- API - Aides-territoires : https://aides-territoires.beta.gouv.fr/api/swagger/
  - https://github.com/MTES-MCT/aides-territoires/wiki/Comment-publier-vos-donn%C3%A9es-pour-une-reprise-sur-Aides-territoires
  - https://aides-territoires.beta.gouv.fr/api/swagger/?version=1.4
- API - Aides 1 jeune 1 solution :
  - https://mes-aides.1jeune1solution.beta.gouv.fr/api/benefits
  - https://github.com/betagouv/aides-jeunes/blob/master/contribuer/public/admin/config.yml
  - https://github.com/betagouv/aides-jeunes/tree/master/data/benefits/javascript
  - https://contribuer-aides-jeunes.netlify.app/admin/#/
  - (contribution w/ Netlify CMS) https://github.com/betagouv/aides-jeunes/tree/master/data/benefits/javascript

## Links and references

- Questionnaires
  - https://diag.bpifrance.fr/
  - https://clic-agil.climaxion.fr/
  - https://entreprendre.service-public.fr/vosdroits/N31906
- Schemas / aid data models
  - https://schema.data.gouv.fr/etalab/schema-dispositif-aide/0.0.2/documentation.html#propriete-condition-eligibilite
  - https://github.com/MTES-MCT/aides-territoires/wiki/Format-des-donn%C3%A9es-publi%C3%A9es-sur-Aides-territoires
  - https://www.insee.fr/fr/information/2406147
  - https://publi.codes/
  - cf "open fisca"
  - cf "mon entreprise"
- Others
  - https://www.entreprises.gouv.fr/files/files/secteurs-d-activite/industrie/decarbonation/transition-ecologique-guidedes-aides-pour-les-tpe-pme.pdf
  - https://www.gouvernement.fr/france-nation-verte
  - https://conseillers-entreprises.service-public.fr/aide-entreprise/accueil/theme/environnement-transition-ecologique
  - https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/2022/tremplin-transition-ecologique-pme

---

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
