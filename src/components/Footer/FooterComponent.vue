<template>
  <div class="bg-white p-[20px]">
   <div class="flex w-[60%] md:w-[80%] m-auto items-start flex-col md:flex-row md:justify-between gap-8">
     <RouterLink to="/" class="self-center md:self-auto">
       <img class="logo ml-0_5"
            alt="logo Akia"
            src="../../assets/logo.png">
     </RouterLink>
     <div class="text-xs">
       <h4 class="underline font-bold">Informations</h4>
       <ul>
         <li>
           <RouterLink to="" class="hover:underline">À propos</RouterLink>
         </li>
         <li>
           <RouterLink to="" class="hover:underline">Contact</RouterLink>
         </li>
       </ul>

     </div>
     <div class="text-xs">
       <h4 class="underline font-bold">Informations légales</h4>
       <ul>
         <li>
           <RouterLink :to="{name: 'legalNotices'}" class="hover:underline">Mentions légales</RouterLink>
         </li>
         <li>
           <RouterLink :to="{name: 'cgv'}" class="hover:underline">Conditions de vente</RouterLink>
         </li>
         <li>
           <RouterLink :to="{name: 'deliveryPolicy'}" class="hover:underline">Politique de retour</RouterLink>
         </li>
         <li>
           <RouterLink :to="{name: 'privacyPolicy'}" class="hover:underline">Politique de confidentialité</RouterLink>
         </li>
         <li>
           <RouterLink :to="{name: 'returnAndRefunds'}" class="hover:underline">Politique de retours et remboursements</RouterLink>
         </li>
       </ul>
     </div>
     <div>
       <h4 class="font-bold text-xs underline">Mes réseaux</h4>
       <div class="flex gap-4 mt-1 items-center">
         <a href="https://www.youtube.com/@akia-art/featured" target="_blank">
           <span class="pi pi-youtube text-red font-size-1_5em mr-0_5"></span>
         </a>

         <a href="https://www.tiktok.com/@akia_art" target="_blank">
           <span class="pi pi-tiktok font-size-1_5em mr-0_5"></span>
         </a>

         <a href="https://www.instagram.com/akia____art/" target="_blank">
           <span class="pi pi-instagram font-size-1_5em mr-0_5"></span>
         </a>
       </div>

     </div>
   </div>
    <hr class="mt-2 border-actionColor">
      <div class="text-xs text-center mt-4">© 2026 - Akialoops</div>
  </div>

</template>
<script setup lang="ts">
</script>

<style scoped>
.logo{
  width: 100px;
}
</style>