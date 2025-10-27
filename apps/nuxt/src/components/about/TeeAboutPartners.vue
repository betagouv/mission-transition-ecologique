<template>
  <section class="fr-grid-row fr-my-3w fr-grid-row fr-grid-row-md--gutters fr-grid-row--middle">
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
      <TeeNumberCard
        v-for="(card, index) in cards"
        class="fr-my-2w"
        :key="index"
        :number="card.number"
        :title="card.title"
        :color="card.color"
      >
        <div v-html="card.description"></div>
      </TeeNumberCard>
    </div>
  </section>
</template>

<script setup>
import { Color } from '@tee/common'

const cards = [
  {
    number: '163',
    title: 'Dispositifs d’aides financières',
    description: 'Financements, accompagnements, formations...',
    color: Color.purple
  },
  {
    number: '28',
    title: 'Partenaires publics',
    description: "<div style='display:flex; align-items:center; gap:0.5rem;'><img src='/images/logos/logos-operators.png' alt='Logos de partenaires institutionnels de transition écologique des entreprises' style='max-width:90%;'/>...</div>",
    color: Color.green
  },
  {
    number: '8012',
    title: 'Entreprises accompagnées en 2025',
    color: Color.red
  }
]
</script>
