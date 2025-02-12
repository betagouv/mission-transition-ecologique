<template>
  <div class="fr-container fr-my-2w">
    <DsfrErrorPage
      title="Oups, perdu ?"
      subtitle="Erreur 418: Je suis une théière"
      description="Il semblerait que vous ayez demandé du café à une théière. Essayons de remettre les choses au clair."
      help="Si vous cherchez du thé, vous êtes au bon endroit. Sinon, peut-être voulez-vous retourner à la page d'accueil?"
    >
      <template #default>
        <p>C'est ici que vous pourriez proposer un retour à la page d'accueil ou une tasse de thé virtuelle. 🍵 (slot par défaut)</p>
      </template>
    </DsfrErrorPage>
  </div>
</template>
<script setup lang="ts"></script>
