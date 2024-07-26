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

2. Utilisation à travers le tableau `$colors` et de la fonction `map.get`. 

Exemple, pour obtenir la couleur de fond pour "yellow" :
```scss
@use './src/assets/scss/setting';
@use 'sass:map';

.element {
  background-color: map.get(map.get(setting.$colors, "yellow"), "color");
}
```

3. Utilisation avec une boucle via le tableau `$colors`:

Exemple, pour définir la couleur de fond pour chaque couleur :
```scss
@use './src/assets/scss/setting';

@each $color, $properties in setting.$colors {
  .element-#{$color} {
    background-color: map.get($properties, "color");
  }
}
```

#### Les couleurs de fond
Les classes `.fr-bg--[color]` permettent de définir la couleur de fond d'un élément. Voici comment les utiliser :

Valeurs possibles pour `[color]` sont géré dans `src/assets/scss/setting/_color.scss`

1. Utilisation de base : avec la classe `.fr-bg--[color]` à ajouter à l'élément HTML.

Exemple, pour définir la couleur de fond en bleu :
```html
<div class="fr-bg--blue">...</div>
```

2. Utilisation avec un fond `light` : avec la classe `.fr-bg--[color]--[light]`.  

La valeur `light` permet de définir une couleur de fond plus claire avec un scale de -50%.

Exemple, pour définir la couleur de fond en bleu clair :
```html
<div class="fr-bg--blue--light">...</div>
```

### Outils d'affichage

#### Alignement des textes  
Les classes `.fr-text-[align]` permettent de définir l'alignement du texte. Voici comment les utiliser :

Valeurs possibles pour `[align]` (`./src/assets/scss/setting/_display.scss`):
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

### Typographie

#### La taille de la ligne de texte
La classe `.fr-line-height--[size]` permet de définir la hauteur de ligne du texte. Voici comment l'utiliser :

Valuers possibles pour `[size]`(`./src/assets/scss/setting/_typography.scss`):
- `4v` : hauteur de ligne de 1rem
- `5v` : hauteur de ligne de 1.25rem
- `6v` : hauteur de ligne de 1.5rem
- `7v` : hauteur de ligne de 1.75rem
- `8v` : hauteur de ligne de 2rem
- `9v` : hauteur de ligne de 2.25rem

1. Utilisation de base : avec la classe `.fr-line-height--[size]` à ajouter à l'élément HTML.

Exemple, pour définir une hauteur de ligne de 1.5rem :
```html
<p class="fr-line-height--6v">...</p>
```

##### La couleur des textes
La classe `.fr-text--[color]` permet de définir la couleur du texte. Voici comment l'utiliser :

Valeurs possibles pour `[color]` sont géré dans `./src/assets/scss/setting/_color.scss`

1. Utilisation de base : avec la classe `.fr-text--[color]` à ajouter à l'élément HTML.

Exemple, pour définir la couleur du texte en bleu :
```html
<p class="fr-text--blue">...</p>
```

### L'arrondie des coins
La classe `.fr-radius-[corner]` permet d'appliquer un rayon de bordure à un coin spécifique d'un élément. Voici comment l'utiliser :

Valeurs possibles pour `[corner]` (`./src/assets/scss/setting/_radius.scss`):
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

2. Utilisation avec différentes tailles : avec la classe `.fr-radius-[corner]--[rounded]` afin de preciser la taille de rayon.

Valeurs possibles pour `[rounded]` (`./src/assets/scss/setting/_radius.scss`):
- `0` : rayon de 0rem
- `0-5v` : rayon de 0.5rem
- `1v` : rayon de 1rem
- `1-5v` : rayon de 1.5rem
- `2v` : rayon de 2rem
- `2-5v` : rayon de 2.5rem

Exemple, pour appliquer un petit rayon au coin supérieur droit :
```html
<div class="fr-radius-tr--0-5v">...</div>
```

### Les tags de couleurs
L'utilisation de la classe `.fr-tag--[color]` en combinaison avec `.fr-tag`  permet de changer la couleur de fond du tag lorsque le tag a été sélectionné. Remplacez [color] par le nom de la couleur souhaitée.

Exemple, pour un tag avec une couleur de fond bleue lorsqu'il est sélectionné :
```html
<div class="fr-tag fr-tag--blue">...</div>
```

### Les cartes de couleurs
L'utilisation de la classe `.fr-card--[color]` en combinant avec `.fr-card` permet de changer la couleur de fond de la carte. Remplacez [color] par le nom de la couleur souhaitée.  
Cette classe est, par exemple, utilisée pour l'affichage des cartes Objectif sur le component [`TeeObjectiveCard`](src/components/theme/ThemeCard.vue).

Exemple, pour une carte avec une couleur de fond bleue :
```html
<div class="fr-card fr-card--blue">...</div>
```

### Grid

#### Les colonnes

##### Alignement vertical

Les classes `.fr-col-content--[align]` permettent de définir l'alignement **vertical** du contenu dans une colonne. Voici comment les utiliser :

Valeurs possibles pour `[align]` (`./src/assets/scss/setting/_grid.scss`):
- `top` : alignement en haut
- `middle` : alignement au centre
- `bottom` : alignement en bas

1. Utilisation de base : avec la classe `.fr-col-content--[align]` à ajouter à l'élément HTML.

Exemple, pour aligner le contenu en bas d'une colonne :
```html
<div class="fr-col-content--bottom">...</div>
```

##### Alignement horizontal

Les classes `.fr-col-justify--[align]` permettent de définir l'alignement **horizontal** du contenu dans une colonne. Voici comment les utiliser :

Valeurs possibles pour `[align]` (`./src/assets/scss/setting/_grid.scss`):
- `left` : alignement à gauche
- `center` : alignement au centre
- `right` : alignement à droite

1. Utilisation de base : avec la classe `.fr-col-justify--[align]` à ajouter à l'élément HTML.

Exemple, pour aligner le contenu à droite d'une colonne :
```html
<div class="fr-col-justify--right">...</div>
```
