<template>
  <p>Pour poursuivre votre achat, veuillez vous connecter ou créer un compte.</p>
  <p>Les articles présent dans votre panier ne sont réservés qu’au clic sur « Se connecter » ou « Créer un compte »</p>
  <p>Avant cette étape, un client déjà connecté peut être prioritaire s’il finalise l’achat.</p>
  <p>Si le produit n’est plus disponible, une précommande sera proposée (expédition sous 3 semaines).</p>
  <div class="flex items-center justify-center gap-4 mt-4">
    <Button label="Se connecter" @click="goTo(CONNEXION_ROUTE)"/>
    <Button class="p-button-white" label="Créer un compte"
            @click="goTo(INSCRIPTION_ROUTE)"/>
  </div>


</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { CONNEXION_ROUTE, INSCRIPTION_ROUTE } from '@/router/routes-name.ts';

const router = useRouter();

const goTo = (path: string) => {
  router.push({name: path});
}
</script>