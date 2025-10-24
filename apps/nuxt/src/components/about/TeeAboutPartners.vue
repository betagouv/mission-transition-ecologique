<template>
  <section class="fr-grid-row fr-my-3w fr-grid-row">
    <div class="fr-col-12 fr-col-md-7">
      <h2>Le fruit d’un partenariat entre acteurs publics</h2>

      <p>
        La plateforme est le fruit d’une <strong>coopération entre plusieurs opérateurs publics</strong> :
        <a
          href="https://www.ademe.fr/"
          target="_blank"
          rel="noopener"
          >l’ADEME</a
        >,
        <a
          href="https://www.bpifrance.fr/"
          target="_blank"
          rel="noopener"
          >Bpifrance</a
        >,
        <a
          href="https://www.cci.fr/"
          target="_blank"
          rel="noopener"
          >les CCI</a
        >,
        <a
          href="https://www.artisanat.fr/"
          target="_blank"
          rel="noopener"
          >la CMA</a
        >,
        <a
          href="https://www.ofb.gouv.fr/"
          target="_blank"
          rel="noopener"
          >l’OFB</a
        >
        et d'autres acteurs publics sous le pilotage du ministère de la Transition écologique, du ministère de l’Économie et des Finances,
        du Secrétariat général à la Planification écologique, et du Commissariat général au développement durable.
      </p>

      <p>
        Cette alliance a pour objectif de simplifier les recherches des entreprises en centralisant au même endroit les aides qui leur sont
        destinées.
      </p>

      <p>
        Par ailleurs, l’équipe travaille en lien étroit avec les entreprises utilisatrices, les organisations et fédérations
        professionnelles pour ajuster et améliorer la plateforme en continu (la Confédération des PME, l’Union des entreprises de proximité,
        le Réseau Entreprendre, les Entreprises s’engagent, La Clef Verte, etc.).
      </p>
    </div>
    <div class="fr-col-12 fr-col-md-5">
      <DsfrTiles
        :tiles
        horizontal
      />
    </div>
  </section>
</template>

<script setup>
import { Color } from '@tee/common'

const tiles = [
  {
    title: '163',
    description: 'Dispositifs d’aides financières \n Financements, accompagnements, formations...',
    color: Color.blue
  },
  {
    title: '28',
    description: 'Partenaires publics \n logos :ademe, bpi, cci, cma + symbol ...',
    color: Color.green
  },
  {
    title: '8012',
    description: 'Entreprises accompagnées en 2025',
    color: Color.red
  }
]
</script>
