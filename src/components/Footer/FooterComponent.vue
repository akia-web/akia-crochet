<template>
  <div class="bg-white p-[10px]">
   <div class="flex w-[80%] m-0-auto justify-between">
     <RouterLink to="/">
       <img class="logo ml-0_5"
            alt="logo Akia"
            src="@/assets/logo.png">
     </RouterLink>
     <div>
       <p>Mentions légales</p>
     </div>
     <div>
       <p>Mes réseaux</p>
       <div class="flex">
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
  </div>

</template>
<script setup lang="ts">
</script>

<style scoped>
.logo{
  width: 50px;
}
</style>