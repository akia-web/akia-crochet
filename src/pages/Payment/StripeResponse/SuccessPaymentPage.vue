<template>

  <div class="bg-white  md:w-[50%]  mx-auto">
    <img src="../../../assets/icones/ligneTicket.svg" class="w-full" alt="">
    <div class="p-[20px] pt-8">
      <img src="../../../assets/icones/quokkaWaw.png"
           alt="quokka émerveillé"
           class="w-[150px] ml-auto mr-auto mt-16 mb-4">
      <h1 class="text-center text-xl mb-12">Merci pour votre commande !</h1>

      <div class="flex flex-col w-[80%] m-auto">
        <p class="mb-2">Votre paiement a bien été confirmé.</p>
        <p class="mb-2">Vous allez recevoir un email de confirmation très prochainement.</p>
        <p class="mb-12">Si votre commande contient un article en précommande, son expédition interviendra sous environ 3 semaines.</p>

      </div>

      <div class="flex justify-center pb-8" v-if="!storeUser.user">
        <Button label="Créer mon compte pour suivre ma commande"
                class="mx-auto"
        @click="goTo()"/>
      </div>


    </div>
  </div>

</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user.ts';
import { useRoute, useRouter } from 'vue-router';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import { onMounted } from 'vue';

const storeUser = useUserStore()
const storeProductsCart = useProductsCartStore()
const route = useRoute()
const router = useRouter()
const email = route.query.email

onMounted(async () => {
  storeProductsCart.deleteCart()
})


const goTo = () => {
  router.push(`/inscription?email=${email}`)
}
</script>