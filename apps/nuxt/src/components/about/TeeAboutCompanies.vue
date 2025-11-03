<template>
  <section class="fr-my-3w">
    <h2>À la rencontre des entreprises</h2>
    <p>
      En 2025, notre ambition est de <strong>faire connaître le service à toutes les TPE et PME françaises</strong>
      et de les accompagner concrètement dans leur transition écologique.
    </p>

    <p>Pour y parvenir, <strong>nous allons à la rencontre des entreprises</strong>, sur le terrain comme en ligne :</p>

    <ul>
      <li>
        <strong>Sur le terrain</strong>, nous venons à la rencontre des dirigeants et acteurs économiques lors de grands événements comme le
        Forum Économique Breton, le Salon Produrable, les 10 ans d’ACT, et d’autres rendez-vous phares de la transition écologique. Ces
        moments d’échange nous permettent d’écouter, de mieux comprendre les attentes et de faire connaître notre service.
      </li>
      <li>
        <strong>Tous les mois</strong>, nous animons des webinaires mensuels ouverts à toutes les entreprises. L’occasion de présenter le
        service, de répondre en direct aux questions et de mettre en lumière les aides financières ou accompagnements proposés par nos
        partenaires publics.
      </li>
    </ul>

    <p>
      👉
      <a :href="Contact.mailTo"> Nous contacter pour s’inscrire à la prochaine démo en ligne </a>
    </p>

    <ul>
      <li>
        <strong>Au fil des retours des entreprises</strong>, nous faisons évoluer ce service numérique pour mieux répondre à leurs besoins.
        Nous organisons régulièrement des tests utilisateurs, échangeons avec les dirigeants et recueillons leurs retours d’expérience pour
        améliorer la plateforme.e. Fidèles à l’approche startup d’État, notre équipe conçoit, teste et améliore en continu la plateforme
        pour qu’elle reste simple, efficace et en phase avec les besoins de ses utilisateurs.
      </li>
    </ul>

    <TeeDsfrButton>
      <template #default> TODO Je donne mon avis </template>
    </TeeDsfrButton>

    <p class="fr-pt-2w">
      Au cours des douze derniers mois, la plateforme a enregistré
      <strong>plus de 84&nbsp;000 visites</strong> et permis à plusieurs milliers d’entreprises de trouver les
      <strong>aides et accompagnements correspondant à leurs projets de transition écologique</strong>.
    </p>
  </section>
</template>

<script setup lang="ts">
import Contact from '@/tools/contact'
</script>
