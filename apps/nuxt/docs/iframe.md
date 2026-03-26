# Système d'iframe TEE

## Vue d'ensemble

Le système d'iframe permet à des sites tiers d'intégrer des composants TEE via une simple balise `<script>`. Il se base sur la librairie **iframe-resizer** pour le redimensionnement automatique.

---

## Architecture

```
scripts/iframe.ts          ← source du script parent (bundlé par esbuild)
  └─> src/public/scripts/iframe.js   ← script distribué (généré, minifié)

src/tools/iframe/iframe.ts           ← utilitaire Iframe (is(), getScript())
src/layouts/iframe.vue               ← layout minimal pour les pages iframe
src/pages/iframe/
  ├── index.vue                      ← vue générique
  ├── siret/index.vue                ← parcours profil entreprise (2 étapes)
  └── projet/[projectSlug].vue       ← vue projet spécifique
src/components/element/card/TeeIframeCard.vue  ← carte réutilisable
```

---

## Génération du script

```bash
npm run generate:iframe-script        # génère iframe.js
npm run generate:iframe-script:watch  # mode watch
```

Le script `scripts/iframe.ts` est bundlé avec **esbuild** (CJS, minifié) vers `src/public/scripts/iframe.js`.

---

## Intégration côté site tiers

Un seul tag `<script>` suffit pour embarquer un composant :

```html
<!-- Vue générique -->
<script
  id="transition-ecologique-entreprise"
  src="https://mission-transition-ecologique.beta.gouv.fr/scripts/iframe.js"
></script>

<!-- Vue projet spécifique -->
<script
  id="transition-ecologique-entreprise"
  src="https://mission-transition-ecologique.beta.gouv.fr/scripts/iframe.js"
  data-type="projet"
  data-id="diag-360"
></script>

<!-- Profil SIRET (étape 1) -->
<script
  id="transition-ecologique-entreprise"
  src="https://mission-transition-ecologique.beta.gouv.fr/scripts/iframe.js"
  data-type="siret"
  data-source="tee"
></script>

<!-- Profil SIRET (étape 2 directe) -->
<script
  id="transition-ecologique-entreprise"
  src="https://mission-transition-ecologique.beta.gouv.fr/scripts/iframe.js"
  data-type="siret-profile"
  data-source="tee"
></script>
```

### Attributs `data-*` disponibles

| Attribut | Valeurs | Description |
|---|---|---|
| `data-type` | `projet`, `siret`, `siret-profile` | Type de vue à afficher |
| `data-id` | slug projet | Identifiant du projet (pour `data-type="projet"`) |
| `data-source` | ex: `tee` | Source pour tracking UTM |

---

## Fonctionnement du script parent (`scripts/iframe.ts`)

Lors de l'exécution, le script :

1. **Détecte ses propres attributs** `data-*` pour choisir la vue
2. **Construit l'URL** de l'iframe avec les paramètres :
   - `parent_url` : URL de la page hôte
   - `utm_campaign` : `iframe` ou `iframe_siret`
   - `utm_source` : valeur de `data-source`
   - `step` : `2` pour `siret-profile`
3. **Crée l'élément `<iframe>`** avec la classe `.iframe-tee`
4. **Active iframe-resizer** (`@iframe-resizer/parent`) pour le redimensionnement automatique
5. **Insère l'iframe** avant la balise `<script>`

---

## Pages iframe

### `/iframe` — Vue générique
- Affiche `TeeIframeCard` (fond violet)
- Analytics : `generic_iframe_view`

### `/iframe/projet/[projectSlug]` — Vue projet
- Affiche une carte avec lien vers le détail du projet
- Middleware `hasProject` pour valider le slug
- Analytics : `iframe_view` avec titre et type du projet

### `/iframe/siret` — Parcours profil entreprise

Flux en 2 étapes :

```
Étape 1 (vert)          Étape 2 (bleu)
┌─────────────┐         ┌──────────────────┐
│   TeeCta    │ ──────> │ TeeRegisterSiret │
│  (bouton)   │         │ TeeProfileDetails│
└─────────────┘         └──────────────────┘
                               │
                               ▼
                    Ouverture du catalogue
                    en nouvel onglet
```

- Paramètres query : `parent_url`, `utm_source`, `step`
- Persist l'état via `CompanyData` store
- Analytics : `generic_iframe_siret_view`

---

## Utilitaire `Iframe`

`src/tools/iframe/iframe.ts`

```typescript
Iframe.getScript()  // retourne l'URL absolue vers iframe.js (côté client)
Iframe.is()         // true si la page est chargée dans un iframe
```

---

## Redimensionnement automatique

- **Côté parent** : `@iframe-resizer/parent` (dans `scripts/iframe.ts`)
- **Côté enfant** : `@iframe-resizer/child` (importé dans chaque page et `TeeIframeCard`)

Les deux participent pour ajuster la hauteur de l'iframe au contenu dynamiquement.

---

## Page de démo

`/demo/iframe` (`src/pages/demo/iframe.client.vue`) — visible uniquement côté client, affiche les 4 types d'embed pour tester localement.

Fichier de test HTML standalone : `iframe_test.html`

---

## Toutes les pages iframe partagent
- Layout `iframe` (wrapper minimal, sans nav)
- Meta robots `noindex, follow`
- Paramètre `parent_url` pour le tracking analytics
