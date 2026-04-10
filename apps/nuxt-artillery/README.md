# Artillery Load Testing with Playwright

Tests de charge et de navigation pour l'application TEE (Transition Écologique des Entreprises), basés sur Artillery et Playwright (TypeScript).

## Fichiers de configuration

| Fichier | Type | Description |
|---|---|---|
| `artillery-page.yml` | Navigation Playwright | Parcours complet de toutes les pages (accueil, listes, détails aides et projets) — 1 utilisateur |
| `artillery-load-test.yml` | Charge HTTP | Requêtes HTTP simples sur les pages clés |
| `artillery-realistic-1h.yml` | Navigation Playwright | Simulation réaliste d'1 heure de trafic (~100 utilisateurs, comportements variés) |

---

## Commandes

Depuis la racine du projet :

```bash
# --- Tests de navigation (artillery-page.yml) ---
npm run artillery:page:dev        # développement local
npm run artillery:page:staging    # staging
npm run artillery:page:prod       # production

# --- Tests de charge HTTP (artillery-load-test.yml) ---
npm run artillery:load:dev
npm run artillery:load:staging
npm run artillery:load:prod

# --- Simulation réaliste 1h (artillery-realistic-1h.yml) ---
npm run artillery:realistic:dev
npm run artillery:realistic:staging
npm run artillery:realistic:prod
```

Ou directement depuis `apps/nuxt-artillery/` :

```bash
npx artillery run -e development  artillery-page.yml
npx artillery run -e staging      artillery-realistic-1h.yml
npx artillery run -e production   artillery-realistic-1h.yml
```

---

## Test réaliste 1h (`artillery-realistic-1h.yml`)

### Profil de charge

~100 utilisateurs virtuels sur 60 minutes, répartis en 3 phases :

| Phase | Durée | Utilisateurs | Débit |
|---|---|---|---|
| Warm up | 15 min | 15 | ~1/min |
| Peak usage | 30 min | 60 | ~2/min |
| Wind down | 15 min | 25 | ~1.7/min |

### Scénarios (pondération 50/50)

**`browseStandard`** — parcours classique :
1. Accueil → pause 3–7 s
2. Liste des aides → pause 4–9 s → visite 2 à 4 aides aléatoires (5–15 s de lecture chacune)
3. Liste des projets → pause 3–7 s → visite 1 à 3 projets aléatoires (4–10 s de lecture chacun)

**`browseWithSiret`** — utilisateur arrivant via un lien partagé :
1. Atterrissage direct sur `/aides-entreprise/[slug]?siret=XXX&effectif=YYY` → lecture 8–20 s
2. Liste des aides → pause → visite 1 à 3 aides aléatoires
3. Liste des projets → pause → visite 1 à 2 projets aléatoires

### Profils SIRET

50 profils réels d'entreprises iséroises (source : `recherche-entreprises.api.gouv.fr`), couvrant l'ensemble des tranches d'effectif :

| Catégorie | Employés | Profils |
|---|---|---|
| MICRO | 0–9 | 15 |
| TPE | 10–19 | 13 |
| PE | 20–249 | 11 |
| ME | 250–499 | 6 |
| ETI | 500–4999 | 3 |
| GE | 5000+ | 2 |

---

## Architecture du code

### Classes de pages (`src/pages/`)

```
BasePage (abstraite)
├── Homepage   — page d'accueil
├── Programs   — liste des aides + pages individuelles
└── Projects   — liste des projets + pages individuelles
```

**`BasePage`** expose les options suivantes via son constructeur :

| Paramètre | Type | Défaut | Rôle |
|---|---|---|---|
| `page` | `Page` | — | instance Playwright |
| `step` | `Step` | — | reporter Artillery |
| `withRefresh` | `boolean` | `false` | recharge la page avant chaque navigation |
| `maxPages` | `number` | `undefined` | limite le nombre de pages visitées (shuffle aléatoire) ; `undefined` = toutes |
| `thinkTime` | `{ min, max }` | `undefined` | pause en ms entre chaque page ; `undefined` = aucune |

### Processors (`src/`)

| Fichier | Fonctions exportées | Utilisé par |
|---|---|---|
| `browse-pages.ts` | `browsePages` | `artillery-page.yml` — toutes les pages, sans pause |
| `realistic-browse.ts` | `browseStandard`, `browseWithSiret` | `artillery-realistic-1h.yml` — navigation partielle + pauses |

#### Helpers dans `realistic-browse.ts`

- **`createPages(page, step, maxPrograms, maxProjects)`** — instancie Homepage, Programs et Projects avec `withRefresh: true` et la configuration de think time
- **`navigateThenVisit(navigate, visit, page, scanWait)`** — navigue vers une section, attend que l'utilisateur parcoure la liste, puis visite les pages

---

## Références

- [Documentation Artillery](https://www.artillery.io/docs)
- [Artillery + Playwright](https://www.artillery.io/docs/reference/engines/playwright)

